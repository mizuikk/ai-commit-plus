import * as vscode from 'vscode';
import { generateCommitMsg, getRepo } from './generate-commit-msg';
import { ConfigKeys, ConfigurationManager } from './config';

/**
 * Supported commit message languages exposed in the command picker.
 * The labels match the configuration enum values declared in package.json.
 */
const COMMIT_LANGUAGE_OPTIONS = [
  { label: 'Simplified Chinese', description: '简体中文' },
  { label: 'Traditional Chinese', description: '繁體中文' },
  { label: 'Japanese', description: 'にほんご' },
  { label: 'Korean', description: '한국어' },
  { label: 'Czech', description: 'česky' },
  { label: 'German', description: 'Deutsch' },
  { label: 'French', description: 'française' },
  { label: 'Italian', description: 'italiano' },
  { label: 'Dutch', description: 'Nederlands' },
  { label: 'Portuguese', description: 'português' },
  { label: 'Vietnamese', description: 'tiếng Việt' },
  { label: 'English', description: 'english' },
  { label: 'Spanish', description: 'español' },
  { label: 'Swedish', description: 'Svenska' },
  { label: 'Russian', description: 'русский' },
  { label: 'Bahasa', description: 'bahasa' },
  { label: 'Polish', description: 'Polski' },
  { label: 'Turkish', description: 'Turkish' },
  { label: 'Thai', description: 'ไทย' }
] as const;

/**
 * Quick pick item used for language selection.
 */
interface CommitLanguageQuickPickItem extends vscode.QuickPickItem {
  language?: string;
  clearsOverride?: boolean;
}

/**
 * Determines which configuration target should store the repository language override.
 *
 * @param {vscode.Uri} resourceUri - The repository root URI.
 * @returns {vscode.ConfigurationTarget} The most specific configuration target available.
 * @throws {Error} Propagates unexpected VS Code workspace API failures.
 * @sideEffects Reads the current workspace structure to choose a settings target.
 */
function getRepositoryLanguageTarget(
  resourceUri: vscode.Uri
): vscode.ConfigurationTarget {
  return vscode.workspace.getWorkspaceFolder(resourceUri)
    ? vscode.ConfigurationTarget.WorkspaceFolder
    : vscode.workspace.workspaceFile || vscode.workspace.workspaceFolders?.length
      ? vscode.ConfigurationTarget.Workspace
      : vscode.ConfigurationTarget.Global;
}

/**
 * Reads the effective and scoped language settings for the current repository.
 *
 * @param {vscode.Uri} resourceUri - The repository root URI.
 * @returns {{ effectiveLanguage: string; inheritedLanguage: string; overrideLanguage?: string; target: vscode.ConfigurationTarget }} The resolved language metadata.
 * @throws {Error} Propagates unexpected VS Code configuration API failures.
 * @sideEffects Reads VS Code configuration values for the repository scope.
 */
function getRepositoryLanguageState(resourceUri: vscode.Uri): {
  effectiveLanguage: string;
  inheritedLanguage: string;
  overrideLanguage?: string;
  target: vscode.ConfigurationTarget;
} {
  const target = getRepositoryLanguageTarget(resourceUri);
  const config = vscode.workspace.getConfiguration('ai-commit-plus', resourceUri);
  const inspectedLanguage = config.inspect<string>(ConfigKeys.AI_COMMIT_LANGUAGE);
  const effectiveLanguage = config.get<string>(ConfigKeys.AI_COMMIT_LANGUAGE, 'English');

  let inheritedLanguage = inspectedLanguage?.defaultValue ?? 'English';
  let overrideLanguage: string | undefined;
  if (target === vscode.ConfigurationTarget.WorkspaceFolder) {
    overrideLanguage = inspectedLanguage?.workspaceFolderValue;
    inheritedLanguage =
      inspectedLanguage?.workspaceValue ??
      inspectedLanguage?.globalValue ??
      inspectedLanguage?.defaultValue ??
      'English';
  } else if (target === vscode.ConfigurationTarget.Workspace) {
    overrideLanguage = inspectedLanguage?.workspaceValue;
    inheritedLanguage =
      inspectedLanguage?.globalValue ?? inspectedLanguage?.defaultValue ?? 'English';
  } else {
    overrideLanguage = inspectedLanguage?.globalValue;
  }

  return {
    effectiveLanguage,
    inheritedLanguage,
    overrideLanguage,
    target
  };
}

/**
 * Builds the quick pick items used to select or clear a repository language override.
 *
 * @param {string} effectiveLanguage - The language currently applied to the repository.
 * @param {string} inheritedLanguage - The language that would be used after clearing the override.
 * @param {string} overrideLanguage - The language explicitly stored for the repository target.
 * @returns {CommitLanguageQuickPickItem[]} The quick pick items shown to the user.
 * @throws {Error} Propagates unexpected item construction failures.
 * @sideEffects None.
 */
function createRepositoryLanguageQuickPickItems(
  effectiveLanguage: string,
  inheritedLanguage: string,
  overrideLanguage?: string
): CommitLanguageQuickPickItem[] {
  const clearOverrideLabel = overrideLanguage
    ? `Clear repository override (${inheritedLanguage})`
    : `Use inherited default (${inheritedLanguage})`;

  const clearOverrideDetail = overrideLanguage
    ? 'Remove the repository-specific language and fall back to the inherited setting.'
    : 'No repository-specific language is stored right now.';

  return [
    {
      label: clearOverrideLabel,
      description: 'Reset',
      detail: clearOverrideDetail,
      clearsOverride: true
    },
    ...COMMIT_LANGUAGE_OPTIONS.map((option) => ({
      label: option.label,
      description: option.description,
      detail:
        option.label === overrideLanguage
          ? 'Current repository override'
          : option.label === effectiveLanguage
            ? 'Current effective language'
            : undefined,
      language: option.label
    }))
  ];
}

/**
 * Prompts the user to store a commit language override for the current repository.
 *
 * @param {any} arg - The command argument that may identify the current repository.
 * @returns {Promise<void>} Resolves when the setting update has completed.
 * @throws {Error} Throws when the repository cannot be resolved or the configuration update fails.
 * @sideEffects Opens a quick pick, writes VS Code settings, and shows a confirmation message.
 */
async function setCommitLanguageForCurrentRepository(arg?: any): Promise<void> {
  const repo = await getRepo(arg);
  const resourceUri = repo.rootUri;
  const configManager = ConfigurationManager.getInstance();
  const languageState = getRepositoryLanguageState(resourceUri);
  const selection = await vscode.window.showQuickPick(
    createRepositoryLanguageQuickPickItems(
      languageState.effectiveLanguage,
      languageState.inheritedLanguage,
      languageState.overrideLanguage
    ),
    {
      placeHolder: `Select a commit language for ${repo.rootUri.fsPath}`
    }
  );

  if (!selection) {
    return;
  }

  if (selection.clearsOverride) {
    await configManager.updateConfig<string>(
      ConfigKeys.AI_COMMIT_LANGUAGE,
      undefined,
      languageState.target,
      resourceUri
    );
    vscode.window.showInformationMessage(
      `AI Commit Plus language for this repository now follows the inherited setting: ${languageState.inheritedLanguage}.`
    );
    return;
  }

  if (!selection.language) {
    return;
  }

  await configManager.updateConfig(
    ConfigKeys.AI_COMMIT_LANGUAGE,
    selection.language,
    languageState.target,
    resourceUri
  );

  vscode.window.showInformationMessage(
    `AI Commit Plus language for this repository set to ${selection.language}.`
  );
}

/**
 * Manages the registration and disposal of commands.
 */
export class CommandManager {
  private disposables: vscode.Disposable[] = [];

  constructor(private context: vscode.ExtensionContext) {}

  /**
   * Registers all extension commands.
   *
   * @returns {void} Nothing.
   * @throws {Error} Propagates command registration failures.
   * @sideEffects Registers VS Code commands and stores their disposables.
   */
  registerCommands() {
    this.registerCommand('extension.ai-commit-plus', generateCommitMsg);
    this.registerCommand(
      'ai-commit-plus.setCommitLanguageForCurrentRepository',
      setCommitLanguageForCurrentRepository
    );
    this.registerCommand('extension.configure-ai-commit-plus', () =>
      vscode.commands.executeCommand('workbench.action.openSettings', 'ai-commit-plus')
    );

    // Show available OpenAI models
    this.registerCommand('ai-commit-plus.showAvailableModels', async () => {
      const configManager = ConfigurationManager.getInstance();
      const models = await configManager.getAvailableOpenAIModels();
      const selected = await vscode.window.showQuickPick(models, {
        placeHolder: 'Please select a model'
      });
      
      if (selected) {
        const config = vscode.workspace.getConfiguration('ai-commit-plus');
        await config.update('OPENAI_MODEL', selected, vscode.ConfigurationTarget.Global);
      }
    });

    /**
     * @deprecated
     * This function is deprecated because Gemini API does not currently support listing models via API.
     * 
     * Show available Gemini models
     */
    /*
    this.registerCommand('ai-commit-plus.showAvailableGeminiModels', async () => {
      const configManager = ConfigurationManager.getInstance();
      const models = await configManager.getAvailableGeminiModels(); // Use the updated function
      const selected = await vscode.window.showQuickPick(models, {
        placeHolder: 'Please select a Gemini model'
      });

      if (selected) {
        const config = vscode.workspace.getConfiguration('ai-commit-plus');
        await config.update('GEMINI_MODEL', selected, vscode.ConfigurationTarget.Global);
      }
    });
    */
  }

  /**
   * Registers a command handler with centralized error handling.
   *
   * @param {string} command - The command identifier to register.
   * @param {(...args: any[]) => any} handler - The command implementation.
   * @returns {void} Nothing.
   * @throws {Error} Propagates registration failures from the VS Code API.
   * @sideEffects Registers a VS Code command, shows error notifications, and stores disposables.
   */
  private registerCommand(command: string, handler: (...args: any[]) => any) {
    const disposable = vscode.commands.registerCommand(command, async (...args) => {
      try {
        await handler(...args);
      } catch (error) {
        const result = await vscode.window.showErrorMessage(
          `Failed: ${error.message}`,
          'Retry',
          'Configure'
        );

        if (result === 'Retry') {
          await handler(...args);
        } else if (result === 'Configure') {
          await vscode.commands.executeCommand(
            'workbench.action.openSettings',
            'ai-commit-plus'
          );
        }
      }
    });

    this.disposables.push(disposable);
    this.context.subscriptions.push(disposable);
  }

  /**
   * Disposes all registered commands.
   *
   * @returns {void} Nothing.
   * @throws {Error} Propagates disposable cleanup failures.
   * @sideEffects Releases all registered command disposables.
   */
  dispose() {
    this.disposables.forEach((d) => d.dispose());
  }
}
