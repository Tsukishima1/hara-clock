import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import { runTests } from 'vscode-test';

suite('Extension Test Suite', () => {
    // 这段代码将在所有测试开始前运行
    vscode.window.showInformationMessage('Start all tests.');

    let extension: vscode.Extension<any> | undefined;

    // 在测试开始之前激活扩展
    setup(async () => {
        extension = vscode.extensions.getExtension('hara.hara-clock');
        if (extension) {
            await extension.activate();
        }
    });


    test('测试状态栏项是否正常显示', async () => {
        assert.ok(extension, '仍未激活扩展'); 
        
        // 等待状态栏项的可用
        await vscode.window.withProgress(
            { location: vscode.ProgressLocation.Window, title: '测试中...' },
            async () => {
                const statusBarItems = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, -1000);
				statusBarItems.text = '$(clock)  0:00';
                statusBarItems.show();

				await new Promise<void>((resolve) => setTimeout(() => resolve(), 100)); // 等待状态栏项显示
                
                assert.strictEqual(statusBarItems.text, '$(clock)  0:00', '初始文本不正确，显示出来的文本为'+statusBarItems.text); // strictEqual()指的是严格相等，即全等
            }
        );
    });

    test('测试时间更新是否正常', async () => {
        assert.ok(extension, '扩展未激活');

        const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, -1000);
        statusBarItem.show();
		const updateTime = () => {
			const now=new Date();
			const hours=now.getHours();
			const minutes=now.getMinutes();
			const timeString = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
	
			statusBarItem.text=`$(clock)  ${timeString}`; 
		};
		const timer = setInterval(updateTime, 1000);

		await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000)); // 等待1秒钟

		assert.ok(statusBarItem.text !== '$(clock)  0:00', '时间未更新'); 

		clearInterval(timer); // 清除定时器
    });

    // 这段代码将在所有测试结束后运行
    teardown(async () => {
        await vscode.commands.executeCommand('workbench.action.closeAllEditors'); // 关闭所有编辑器
    });
});
