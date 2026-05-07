import * as vscode from 'vscode';
import { CommandManager } from './commands';
import { ConfigurationManager } from './config';

function createProviderStatusBarItem(
  context: vscode.ExtensionContext,
  configManager: ConfigurationManager
): vscode.StatusBarItem {
  const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 80);

  const refresh = async () => {
    const profile = await configManager.getActiveProviderProfile().catch(() => undefined);
    item.text = profile ? `AI Commit: ${profile.profile.name}` : 'AI Commit: No profile';
    item.tooltip = 'Switch provider profile';
    item.command = 'ai-commit-plus.switchProviderProfile';
    item.show();
  };

  void refresh();

  context.subscriptions.push(
    vscode.commands.registerCommand('ai-commit-plus.refreshProviderStatusBar', refresh)
  );

  return item;
}

/**
 * Activates the extension and registers commands.
 *
 * @param {vscode.ExtensionContext} context - The context for the extension.
 */
export async function activate(context: vscode.ExtensionContext) {
  try {
    const configManager = ConfigurationManager.getInstance(context);
    await configManager.initialize();

    const commandManager = new CommandManager(context);
    commandManager.registerCommands();
    const statusBarItem = createProviderStatusBarItem(context, configManager);

    context.subscriptions.push({
      dispose: () => {
        configManager.dispose();
        commandManager.dispose();
      }
    });
    context.subscriptions.push(statusBarItem);

    const activeProfile = configManager.getProviderProfiles()[0];
    if (!activeProfile) {
      const result = await vscode.window.showWarningMessage(
        'No provider profile is configured. Would you like to create one now?',
        'Yes',
        'No'
      );

      if (result === 'Yes') {
        await vscode.commands.executeCommand('ai-commit-plus.manageProviderProfiles');
      }
      return;
    }

    const activeProfileId = configManager.getActiveProviderProfileId();
    const activeApiKey = activeProfileId
      ? await configManager.getProviderProfileApiKey(activeProfileId)
      : undefined;

    if (!activeApiKey) {
      const result = await vscode.window.showWarningMessage(
        'The active provider profile is missing an API key. Would you like to configure it now?',
        'Yes',
        'No'
      );

      if (result === 'Yes') {
        await vscode.commands.executeCommand('ai-commit-plus.manageProviderProfiles');
      }
    }
  } catch (error) {
    console.error('Failed to activate extension:', error);
    throw error;
  }
}

/**
 * Deactivates the extension.
 * This function is called when the extension is deactivated.
 */
export function deactivate() {}
