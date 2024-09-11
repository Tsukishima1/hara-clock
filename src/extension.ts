import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const timeItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, -1000);
    // 设置默认值
	timeItem.text = '$(clock)  0:00';
	timeItem.tooltip = '当前时间';
	timeItem.show();

    const updateTime = () => {
        const now=new Date();
        const hours=now.getHours();
        const minutes=now.getMinutes();
        const timeString = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;

        timeItem.text=`$(clock)  ${timeString}`; 
    };

    const timer = setInterval(updateTime, 1000);

    context.subscriptions.push(timeItem);
    context.subscriptions.push({ dispose: () => clearInterval(timer) });
}

export function deactivate() {}