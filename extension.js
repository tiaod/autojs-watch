// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

let watcher
function activate(context) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	let channel = vscode.window.createOutputChannel("Autojs watch");
	channel.appendLine('autojs-watch 启用！');
	let config = vscode.workspace.getConfiguration('autojs-watch')
	channel.appendLine('当前监听目录: '+config.watchFolder)
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('autojs-watch.enable', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Autojs自动运行已启用');
		watcher = vscode.workspace.createFileSystemWatcher(config.watchFolder)
		watcher.onDidChange(async e => { // 文件发生更新
			channel.appendLine('change: ' + e.fsPath);
			vscode.window.showInformationMessage('文件发生了更新！');
			await vscode.commands.executeCommand('autojspro.stopAll')
			await vscode.commands.executeCommand('autojspro.run')
		});
		watcher.onDidCreate(e => { // 新建了js文件
			channel.appendLine('create: ' + e.fsPath);
		});
		watcher.onDidDelete(e => { // 删除了js文件
			channel.appendLine('delete: ' + e.fsPath);
		});
		
		
	});
	
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {
	watcher.dispose(); // dispose after usage
}

module.exports = {
	activate,
	deactivate
}
