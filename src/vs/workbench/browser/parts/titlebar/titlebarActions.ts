/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ILocalizedString, localize, localize2 } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { LayoutSettings } from '../../../services/layout/browser/layoutService.js';
import { Action2, MenuId, registerAction2, MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { ContextKeyExpr, ContextKeyExpression, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { ACCOUNTS_ACTIVITY_ID, GLOBAL_ACTIVITY_ID } from '../../../common/activity.js';
import { IAction } from '../../../../base/common/actions.js';
import { IsMainWindowFullscreenContext, IsCompactTitleBarContext, TitleBarStyleContext, TitleBarVisibleContext } from '../../../common/contextkeys.js';
import { CustomTitleBarVisibility, TitleBarSetting, TitlebarStyle } from '../../../../platform/window/common/window.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { RESTART_SESSION_ID, STOP_ID } from '../../../contrib/debug/browser/debugCommands.js';
import { IDebugService } from '../../../contrib/debug/common/debug.js';
import { AssistaIcon } from '../../../../base/common/assistaIcons.js';

// --- Context Menu Actions --- //

export class ToggleTitleBarConfigAction extends Action2 {

	constructor(private readonly section: string, title: string, description: string | ILocalizedString | undefined, order: number, when?: ContextKeyExpression) {

		super({
			id: `toggle.${section}`,
			title,
			metadata: description ? { description } : undefined,
			toggled: ContextKeyExpr.equals(`config.${section}`, true),
			menu: [
				{
					id: MenuId.TitleBarContext,
					when,
					order,
					group: '2_config'
				},
				{
					id: MenuId.TitleBarTitleContext,
					when,
					order,
					group: '2_config'
				}
			]
		});
	}

	run(accessor: ServicesAccessor, ...args: any[]): void {
		const configService = accessor.get(IConfigurationService);
		const value = configService.getValue(this.section);
		configService.updateValue(this.section, !value);
	}
}

registerAction2(class ToggleCommandCenter extends ToggleTitleBarConfigAction {
	constructor() {
		super(LayoutSettings.COMMAND_CENTER, localize('toggle.commandCenter', 'Command Center'), localize('toggle.commandCenterDescription', "Toggle visibility of the Command Center in title bar"), 1, IsCompactTitleBarContext.toNegated());
	}
});

registerAction2(class ToggleNavigationControl extends ToggleTitleBarConfigAction {
	constructor() {
		super('workbench.navigationControl.enabled', localize('toggle.navigation', 'Navigation Controls'), localize('toggle.navigationDescription', "Toggle visibility of the Navigation Controls in title bar"), 2, ContextKeyExpr.and(IsCompactTitleBarContext.toNegated(), ContextKeyExpr.has('config.window.commandCenter')));
	}
});

registerAction2(class ToggleLayoutControl extends ToggleTitleBarConfigAction {
	constructor() {
		super(LayoutSettings.LAYOUT_ACTIONS, localize('toggle.layout', 'Layout Controls'), localize('toggle.layoutDescription', "Toggle visibility of the Layout Controls in title bar"), 4);
	}
});

registerAction2(class ToggleCustomTitleBar extends Action2 {
	constructor() {
		super({
			id: `toggle.${TitleBarSetting.CUSTOM_TITLE_BAR_VISIBILITY}`,
			title: localize('toggle.hideCustomTitleBar', 'Hide Custom Title Bar'),
			menu: [
				{ id: MenuId.TitleBarContext, order: 0, when: ContextKeyExpr.equals(TitleBarStyleContext.key, TitlebarStyle.NATIVE), group: '3_toggle' },
				{ id: MenuId.TitleBarTitleContext, order: 0, when: ContextKeyExpr.equals(TitleBarStyleContext.key, TitlebarStyle.NATIVE), group: '3_toggle' },
			]
		});
	}

	run(accessor: ServicesAccessor, ...args: any[]): void {
		const configService = accessor.get(IConfigurationService);
		configService.updateValue(TitleBarSetting.CUSTOM_TITLE_BAR_VISIBILITY, CustomTitleBarVisibility.NEVER);
	}
});

registerAction2(class ToggleCustomTitleBarWindowed extends Action2 {
	constructor() {
		super({
			id: `toggle.${TitleBarSetting.CUSTOM_TITLE_BAR_VISIBILITY}.windowed`,
			title: localize('toggle.hideCustomTitleBarInFullScreen', 'Hide Custom Title Bar In Full Screen'),
			menu: [
				{ id: MenuId.TitleBarContext, order: 1, when: IsMainWindowFullscreenContext, group: '3_toggle' },
				{ id: MenuId.TitleBarTitleContext, order: 1, when: IsMainWindowFullscreenContext, group: '3_toggle' },
			]
		});
	}

	run(accessor: ServicesAccessor, ...args: any[]): void {
		const configService = accessor.get(IConfigurationService);
		configService.updateValue(TitleBarSetting.CUSTOM_TITLE_BAR_VISIBILITY, CustomTitleBarVisibility.WINDOWED);
	}
});

class ToggleCustomTitleBar extends Action2 {

	constructor() {
		super({
			id: `toggle.toggleCustomTitleBar`,
			title: localize('toggle.customTitleBar', 'Custom Title Bar'),
			toggled: TitleBarVisibleContext,
			menu: [
				{
					id: MenuId.MenubarAppearanceMenu,
					order: 6,
					when: ContextKeyExpr.or(
						ContextKeyExpr.and(
							ContextKeyExpr.equals(TitleBarStyleContext.key, TitlebarStyle.NATIVE),
							ContextKeyExpr.and(
								ContextKeyExpr.equals('config.workbench.layoutControl.enabled', false),
								ContextKeyExpr.equals('config.window.commandCenter', false),
								ContextKeyExpr.notEquals('config.workbench.editor.editorActionsLocation', 'titleBar'),
								ContextKeyExpr.notEquals('config.workbench.activityBar.location', 'top'),
								ContextKeyExpr.notEquals('config.workbench.activityBar.location', 'bottom')
							)?.negate()
						),
						IsMainWindowFullscreenContext
					),
					group: '2_workbench_layout'
				},
			],
		});
	}

	run(accessor: ServicesAccessor, ...args: any[]): void {
		const configService = accessor.get(IConfigurationService);
		const contextKeyService = accessor.get(IContextKeyService);
		const titleBarVisibility = configService.getValue<CustomTitleBarVisibility>(TitleBarSetting.CUSTOM_TITLE_BAR_VISIBILITY);
		switch (titleBarVisibility) {
			case CustomTitleBarVisibility.NEVER:
				configService.updateValue(TitleBarSetting.CUSTOM_TITLE_BAR_VISIBILITY, CustomTitleBarVisibility.AUTO);
				break;
			case CustomTitleBarVisibility.WINDOWED: {
				const isFullScreen = IsMainWindowFullscreenContext.evaluate(contextKeyService.getContext(null));
				if (isFullScreen) {
					configService.updateValue(TitleBarSetting.CUSTOM_TITLE_BAR_VISIBILITY, CustomTitleBarVisibility.AUTO);
				} else {
					configService.updateValue(TitleBarSetting.CUSTOM_TITLE_BAR_VISIBILITY, CustomTitleBarVisibility.NEVER);
				}
				break;
			}
			case CustomTitleBarVisibility.AUTO:
			default:
				configService.updateValue(TitleBarSetting.CUSTOM_TITLE_BAR_VISIBILITY, CustomTitleBarVisibility.NEVER);
				break;
		}
	}
}
registerAction2(ToggleCustomTitleBar);

registerAction2(class ShowCustomTitleBar extends Action2 {
	constructor() {
		super({
			id: `showCustomTitleBar`,
			title: localize2('showCustomTitleBar', "Show Custom Title Bar"),
			precondition: TitleBarVisibleContext.negate(),
			f1: true
		});
	}

	run(accessor: ServicesAccessor, ...args: any[]): void {
		const configService = accessor.get(IConfigurationService);
		configService.updateValue(TitleBarSetting.CUSTOM_TITLE_BAR_VISIBILITY, CustomTitleBarVisibility.AUTO);
	}
});

registerAction2(class HideCustomTitleBar extends Action2 {
	constructor() {
		super({
			id: `hideCustomTitleBar`,
			title: localize2('hideCustomTitleBar', "Hide Custom Title Bar"),
			precondition: TitleBarVisibleContext,
			f1: true
		});
	}

	run(accessor: ServicesAccessor, ...args: any[]): void {
		const configService = accessor.get(IConfigurationService);
		configService.updateValue(TitleBarSetting.CUSTOM_TITLE_BAR_VISIBILITY, CustomTitleBarVisibility.NEVER);
	}
});

registerAction2(class HideCustomTitleBar extends Action2 {
	constructor() {
		super({
			id: `hideCustomTitleBarInFullScreen`,
			title: localize2('hideCustomTitleBarInFullScreen', "Hide Custom Title Bar In Full Screen"),
			precondition: ContextKeyExpr.and(TitleBarVisibleContext, IsMainWindowFullscreenContext),
			f1: true
		});
	}

	run(accessor: ServicesAccessor, ...args: any[]): void {
		const configService = accessor.get(IConfigurationService);
		configService.updateValue(TitleBarSetting.CUSTOM_TITLE_BAR_VISIBILITY, CustomTitleBarVisibility.WINDOWED);
	}
});

registerAction2(class ToggleEditorActions extends Action2 {
	static readonly settingsID = `workbench.editor.editorActionsLocation`;
	constructor() {

		const titleBarContextCondition = ContextKeyExpr.and(
			ContextKeyExpr.equals(`config.workbench.editor.showTabs`, 'none').negate(),
			ContextKeyExpr.equals(`config.${ToggleEditorActions.settingsID}`, 'default'),
		)?.negate();

		super({
			id: `toggle.${ToggleEditorActions.settingsID}`,
			title: localize('toggle.editorActions', 'Editor Actions'),
			toggled: ContextKeyExpr.equals(`config.${ToggleEditorActions.settingsID}`, 'hidden').negate(),
			menu: [
				{ id: MenuId.TitleBarContext, order: 3, when: titleBarContextCondition, group: '2_config' },
				{ id: MenuId.TitleBarTitleContext, order: 3, when: titleBarContextCondition, group: '2_config' }
			]
		});
	}

	run(accessor: ServicesAccessor, ...args: any[]): void {
		const configService = accessor.get(IConfigurationService);
		const storageService = accessor.get(IStorageService);

		const location = configService.getValue<string>(ToggleEditorActions.settingsID);
		if (location === 'hidden') {
			const showTabs = configService.getValue<string>(LayoutSettings.EDITOR_TABS_MODE);

			// If tabs are visible, then set the editor actions to be in the title bar
			if (showTabs !== 'none') {
				configService.updateValue(ToggleEditorActions.settingsID, 'titleBar');
			}

			// If tabs are not visible, then set the editor actions to the last location the were before being hidden
			else {
				const storedValue = storageService.get(ToggleEditorActions.settingsID, StorageScope.PROFILE);
				configService.updateValue(ToggleEditorActions.settingsID, storedValue ?? 'default');
			}

			storageService.remove(ToggleEditorActions.settingsID, StorageScope.PROFILE);
		}
		// Store the current value (titleBar or default) in the storage service for later to restore
		else {
			configService.updateValue(ToggleEditorActions.settingsID, 'hidden');
			storageService.store(ToggleEditorActions.settingsID, location, StorageScope.PROFILE, StorageTarget.USER);
		}
	}
});

// --- Toolbar actions --- //

export const ACCOUNTS_ACTIVITY_TILE_ACTION: IAction = {
	id: ACCOUNTS_ACTIVITY_ID,
	label: localize('accounts', "Accounts"),
	tooltip: localize('accounts', "Accounts"),
	class: undefined,
	enabled: true,
	run: function (): void { }
};

export const GLOBAL_ACTIVITY_TITLE_ACTION: IAction = {
	id: GLOBAL_ACTIVITY_ID,
	label: localize('manage', "Manage"),
	tooltip: localize('manage', "Manage"),
	class: undefined,
	enabled: true,
	run: function (): void { }
};

// --- Run Action --- //

class RunAction extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.run',
			title: localize2('run', "Run"),
			f1: true,
			icon: AssistaIcon.run, // Use the play/run icon from codicons
			menu: [
				{
					id: MenuId.TitleBar,
					group: 'navigation', // Place in navigation group for always visible
					order: 90, // High order to appear after search bar, before layout
					when: ContextKeyExpr.equals('debugState', 'inactive')
				}
			]
		});
	}

	async run(accessor: ServicesAccessor, ...args: any[]): Promise<void> {
		const commandService = accessor.get(ICommandService);
		const debugService = accessor.get(IDebugService);

		// Check if there are any debug configurations available
		const configManager = debugService.getConfigurationManager();
		const configurations = configManager.getAllConfigurations();

		if (configurations.length === 0) {
			// No configurations found, show the debugger sidebar
			await commandService.executeCommand('odoo-source-control.showDebuggerSidebar');
		} else {
			// Configurations found, start debugging normally
			await commandService.executeCommand('workbench.action.debug.start');
		}
	}
}

registerAction2(RunAction);

class DebugAction extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.debug',
			title: localize2('debug', "Debug"),
			f1: true,
			icon: AssistaIcon.debugger, // Use the debugger icon from codicons
			menu: [
				{
					id: MenuId.TitleBar,
					group: 'navigation', // Place in navigation group for always visible
					order: 91 // Right after Run
				}
			]
		});
	}

	run(accessor: ServicesAccessor, ...args: any[]): void {
		const commandService = accessor.get(ICommandService);
		commandService.executeCommand('odoo-source-control.showDebuggerSidebar');
	}
}

registerAction2(DebugAction);

// --- Dynamic Debug Actions --- //

MenuRegistry.appendMenuItem(MenuId.TitleBar, {
	command: {
		id: RESTART_SESSION_ID,
		title: localize2('restart', 'Restart'),
		icon: AssistaIcon.restart
	},
	when: ContextKeyExpr.notEquals('debugState', 'inactive'),
	group: 'navigation',
	order: 90
});

MenuRegistry.appendMenuItem(MenuId.TitleBar, {
	command: {
		id: STOP_ID,
		title: localize2('stop', 'Stop'),
		icon: AssistaIcon.stopDebugging
	},
	when: ContextKeyExpr.notEquals('debugState', 'inactive'),
	group: 'navigation',
	order: 91
});
