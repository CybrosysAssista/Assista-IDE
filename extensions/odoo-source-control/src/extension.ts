/**
 * @file extension.ts
 * @description Main extension file for Odoo Source Control
 * @copyright (c) 2024 Cybrosys Matrix
 * @license MIT
 */

import * as vscode from 'vscode';
import { showWelcomeScreen, checkAndShowConfiguration } from './welcome';
import { handlePullSource, handleCreateConfig, handleConfigDebugger } from './handlers';

export function activate(context: vscode.ExtensionContext) {
	// Register a command to show the welcome screen
	let welcomeCommand = vscode.commands.registerCommand('odoo-source-control.showWelcome', () => {
		showWelcomeScreen();
	});

	context.subscriptions.push(welcomeCommand);

	// Register a command to show configuration
	let configureCommand = vscode.commands.registerCommand('odoo-source-control.showConfigure', () => {
		checkAndShowConfiguration();
	});

	context.subscriptions.push(configureCommand);

	// Register a command to pull Odoo source code
	let pullSourceCommand = vscode.commands.registerCommand('odoo-source-control.pullSource', () => {
		handlePullSource();
	});

	context.subscriptions.push(pullSourceCommand);

	// Register a command to create config
	let createConfigCommand = vscode.commands.registerCommand('odoo-source-control.createConfig', () => {
		handleCreateConfig(context);
	});

	context.subscriptions.push(createConfigCommand);

	// Register a command to configure debugger
	let configDebuggerCommand = vscode.commands.registerCommand('odoo-source-control.configDebugger', () => {
		handleConfigDebugger();
	});

	context.subscriptions.push(configDebuggerCommand);

	// Show welcome screen on first activation if no workspace is open
	if (!vscode.workspace.workspaceFolders) {
		showWelcomeScreen();
	} else {
		// Check if we need to show configuration
		checkAndShowConfiguration();
	}
}

export function deactivate() { }
