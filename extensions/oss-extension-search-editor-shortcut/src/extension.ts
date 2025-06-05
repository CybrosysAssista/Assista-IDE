import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'searchEditorShortcut.openSearchEditor',
    () => {
      vscode.commands.executeCommand('search.action.openNewEditor');
    }
  );

  context.subscriptions.push(disposable);
}
