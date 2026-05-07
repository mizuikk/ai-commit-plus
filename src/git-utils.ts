import simpleGit from 'simple-git';
import * as vscode from 'vscode';

// Built-in Git extension Repository interface (only the fields we need).
// Not in @types/vscode — the Git extension exports this internally.
export interface GitExtensionRepository {
  rootUri: vscode.Uri;
  inputBox: vscode.SourceControlInputBox;
  diffIndexWithHEAD?(): Promise<string>;
}

export async function getDiffStaged(repo: GitExtensionRepository): Promise<string> {
  try {
    const rootPath =
      repo?.rootUri?.fsPath || vscode.workspace.workspaceFolders?.[0].uri.fsPath;

    if (!rootPath) {
      throw new Error('No workspace folder found');
    }

    // Prefer the built-in Git extension API when available
    if (typeof (repo as any).diffIndexWithHEAD === 'function') {
      const diff = await (repo as any).diffIndexWithHEAD();
      return diff || 'No changes staged.';
    }

    // Fallback: simple-git
    const git = simpleGit(rootPath);
    const diff = await git.diff(['--staged']);

    return diff || 'No changes staged.';
  } catch (error) {
    throw new Error(`Failed to get staged changes: ${error instanceof Error ? error.message : String(error)}`);
  }
}
