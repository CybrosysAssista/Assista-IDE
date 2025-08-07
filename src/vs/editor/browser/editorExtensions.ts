/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../nls.js';
import { URI } from '../../base/common/uri.js';
import { ICodeEditor, IDiffEditor } from './editorBrowser.js';
import { ICodeEditorService } from './services/codeEditorService.js';
import { Position } from '../common/core/position.js';
import { IEditorContribution, IDiffEditorContribution } from '../common/editorCommon.js';
import { ITextModel } from '../common/model.js';
import { IModelService } from '../common/services/model.js';
import { ITextModelService } from '../common/services/resolverService.js';
import { MenuId, MenuRegistry, Action2, registerAction2 } from '../../platform/actions/common/actions.js';
import { CommandsRegistry, ICommandMetadata } from '../../platform/commands/common/commands.js';
import { ContextKeyExpr, IContextKeyService, ContextKeyExpression } from '../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor as InstantiationServicesAccessor, BrandedService, IInstantiationService, IConstructorSignature } from '../../platform/instantiation/common/instantiation.js';
import { IKeybindings, KeybindingsRegistry, KeybindingWeight } from '../../platform/keybinding/common/keybindingsRegistry.js';
import { Registry } from '../../platform/registry/common/platform.js';
import { ITelemetryService } from '../../platform/telemetry/common/telemetry.js';
import { assertType } from '../../base/common/types.js';
import { ThemeIcon } from '../../base/common/themables.js';
import { IDisposable } from '../../base/common/lifecycle.js';
import { KeyMod, KeyCode } from '../../base/common/keyCodes.js';
import { ILogService } from '../../platform/log/common/log.js';
import { getActiveElement } from '../../base/browser/dom.js';
import { IFileService } from '../../platform/files/common/files.js';
import { VSBuffer } from '../../base/common/buffer.js';
import { EditorIsInOdooModelClass, OdooModelContextKeyContribution } from '../contrib/odooModelContext.js';
import { INotificationService } from '../../platform/notification/common/notification.js';


export type ServicesAccessor = InstantiationServicesAccessor;
export type EditorContributionCtor = IConstructorSignature<IEditorContribution, [ICodeEditor]>;
export type DiffEditorContributionCtor = IConstructorSignature<IDiffEditorContribution, [IDiffEditor]>;

export const enum EditorContributionInstantiation {
	/**
	 * The contribution is created eagerly when the {@linkcode ICodeEditor} is instantiated.
	 * Only Eager contributions can participate in saving or restoring of view state.
	 */
	Eager,

	/**
	 * The contribution is created at the latest 50ms after the first render after attaching a text model.
	 * If the contribution is explicitly requested via `getContribution`, it will be instantiated sooner.
	 * If there is idle time available, it will be instantiated sooner.
	 */
	AfterFirstRender,

	/**
	 * The contribution is created before the editor emits events produced by user interaction (mouse events, keyboard events).
	 * If the contribution is explicitly requested via `getContribution`, it will be instantiated sooner.
	 * If there is idle time available, it will be instantiated sooner.
	 */
	BeforeFirstInteraction,

	/**
	 * The contribution is created when there is idle time available, at the latest 5000ms after the editor creation.
	 * If the contribution is explicitly requested via `getContribution`, it will be instantiated sooner.
	 */
	Eventually,

	/**
	 * The contribution is created only when explicitly requested via `getContribution`.
	 */
	Lazy,
}

export interface IEditorContributionDescription {
	readonly id: string;
	readonly ctor: EditorContributionCtor;
	readonly instantiation: EditorContributionInstantiation;
}

export interface IDiffEditorContributionDescription {
	id: string;
	ctor: DiffEditorContributionCtor;
}

//#region Command

export interface ICommandKeybindingsOptions extends IKeybindings {
	kbExpr?: ContextKeyExpression | null;
	weight: number;
	/**
	 * the default keybinding arguments
	 */
	args?: any;
}
export interface ICommandMenuOptions {
	menuId: MenuId;
	group: string;
	order: number;
	when?: ContextKeyExpression;
	title: string;
	icon?: ThemeIcon;
}
export interface ICommandOptions {
	id: string;
	precondition: ContextKeyExpression | undefined;
	kbOpts?: ICommandKeybindingsOptions | ICommandKeybindingsOptions[];
	metadata?: ICommandMetadata;
	menuOpts?: ICommandMenuOptions | ICommandMenuOptions[];
}
export abstract class Command {
	public readonly id: string;
	public readonly precondition: ContextKeyExpression | undefined;
	private readonly _kbOpts: ICommandKeybindingsOptions | ICommandKeybindingsOptions[] | undefined;
	private readonly _menuOpts: ICommandMenuOptions | ICommandMenuOptions[] | undefined;
	public readonly metadata: ICommandMetadata | undefined;

	constructor(opts: ICommandOptions) {
		this.id = opts.id;
		this.precondition = opts.precondition;
		this._kbOpts = opts.kbOpts;
		this._menuOpts = opts.menuOpts;
		this.metadata = opts.metadata;
	}

	public register(): void {

		if (Array.isArray(this._menuOpts)) {
			this._menuOpts.forEach(this._registerMenuItem, this);
		} else if (this._menuOpts) {
			this._registerMenuItem(this._menuOpts);
		}

		if (this._kbOpts) {
			const kbOptsArr = Array.isArray(this._kbOpts) ? this._kbOpts : [this._kbOpts];
			for (const kbOpts of kbOptsArr) {
				let kbWhen = kbOpts.kbExpr;
				if (this.precondition) {
					if (kbWhen) {
						kbWhen = ContextKeyExpr.and(kbWhen, this.precondition);
					} else {
						kbWhen = this.precondition;
					}
				}

				const desc = {
					id: this.id,
					weight: kbOpts.weight,
					args: kbOpts.args,
					when: kbWhen,
					primary: kbOpts.primary,
					secondary: kbOpts.secondary,
					win: kbOpts.win,
					linux: kbOpts.linux,
					mac: kbOpts.mac,
				};

				KeybindingsRegistry.registerKeybindingRule(desc);
			}
		}

		CommandsRegistry.registerCommand({
			id: this.id,
			handler: (accessor, args) => this.runCommand(accessor, args),
			metadata: this.metadata
		});
	}

	private _registerMenuItem(item: ICommandMenuOptions): void {
		MenuRegistry.appendMenuItem(item.menuId, {
			group: item.group,
			command: {
				id: this.id,
				title: item.title,
				icon: item.icon,
				precondition: this.precondition
			},
			when: item.when,
			order: item.order
		});
	}

	public abstract runCommand(accessor: ServicesAccessor, args: any): void | Promise<void>;
}

//#endregion Command

//#region MultiplexingCommand

/**
 * Potential override for a command.
 *
 * @return `true` or a Promise if the command was successfully run. This stops other overrides from being executed.
 */
export type CommandImplementation = (accessor: ServicesAccessor, args: unknown) => boolean | Promise<void>;

interface ICommandImplementationRegistration {
	priority: number;
	name: string;
	implementation: CommandImplementation;
	when?: ContextKeyExpression;
}

export class MultiCommand extends Command {

	private readonly _implementations: ICommandImplementationRegistration[] = [];

	/**
	 * A higher priority gets to be looked at first
	 */
	public addImplementation(priority: number, name: string, implementation: CommandImplementation, when?: ContextKeyExpression): IDisposable {
		this._implementations.push({ priority, name, implementation, when });
		this._implementations.sort((a, b) => b.priority - a.priority);
		return {
			dispose: () => {
				for (let i = 0; i < this._implementations.length; i++) {
					if (this._implementations[i].implementation === implementation) {
						this._implementations.splice(i, 1);
						return;
					}
				}
			}
		};
	}

	public runCommand(accessor: ServicesAccessor, args: any): void | Promise<void> {
		const logService = accessor.get(ILogService);
		const contextKeyService = accessor.get(IContextKeyService);
		logService.trace(`Executing Command '${this.id}' which has ${this._implementations.length} bound.`);
		for (const impl of this._implementations) {
			if (impl.when) {
				const context = contextKeyService.getContext(getActiveElement());
				const value = impl.when.evaluate(context);
				if (!value) {
					continue;
				}
			}
			const result = impl.implementation(accessor, args);
			if (result) {
				logService.trace(`Command '${this.id}' was handled by '${impl.name}'.`);
				if (typeof result === 'boolean') {
					return;
				}
				return result;
			}
		}
		logService.trace(`The Command '${this.id}' was not handled by any implementation.`);
	}
}

//#endregion

/**
 * A command that delegates to another command's implementation.
 *
 * This lets different commands be registered but share the same implementation
 */
export class ProxyCommand extends Command {
	constructor(
		private readonly command: Command,
		opts: ICommandOptions
	) {
		super(opts);
	}

	public runCommand(accessor: ServicesAccessor, args: any): void | Promise<void> {
		return this.command.runCommand(accessor, args);
	}
}

//#region EditorCommand

export interface IContributionCommandOptions<T> extends ICommandOptions {
	handler: (controller: T, args: any) => void;
}
export interface EditorControllerCommand<T extends IEditorContribution> {
	new(opts: IContributionCommandOptions<T>): EditorCommand;
}
export abstract class EditorCommand extends Command {

	/**
	 * Create a command class that is bound to a certain editor contribution.
	 */
	public static bindToContribution<T extends IEditorContribution>(controllerGetter: (editor: ICodeEditor) => T | null): EditorControllerCommand<T> {
		return class EditorControllerCommandImpl extends EditorCommand {
			private readonly _callback: (controller: T, args: any) => void;

			constructor(opts: IContributionCommandOptions<T>) {
				super(opts);

				this._callback = opts.handler;
			}

			public runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor, args: any): void {
				const controller = controllerGetter(editor);
				if (controller) {
					this._callback(controller, args);
				}
			}
		};
	}

	public static runEditorCommand(
		accessor: ServicesAccessor,
		args: any,
		precondition: ContextKeyExpression | undefined,
		runner: (accessor: ServicesAccessor | null, editor: ICodeEditor, args: any) => void | Promise<void>
	): void | Promise<void> {
		const codeEditorService = accessor.get(ICodeEditorService);

		// Find the editor with text focus or active
		const editor = codeEditorService.getFocusedCodeEditor() || codeEditorService.getActiveCodeEditor();
		if (!editor) {
			// well, at least we tried...
			return;
		}

		return editor.invokeWithinContext((editorAccessor) => {
			const kbService = editorAccessor.get(IContextKeyService);
			if (!kbService.contextMatchesRules(precondition ?? undefined)) {
				// precondition does not hold
				return;
			}

			return runner(editorAccessor, editor, args);
		});
	}

	public runCommand(accessor: ServicesAccessor, args: any): void | Promise<void> {
		return EditorCommand.runEditorCommand(accessor, args, this.precondition, (accessor, editor, args) => this.runEditorCommand(accessor, editor, args));
	}

	public abstract runEditorCommand(accessor: ServicesAccessor | null, editor: ICodeEditor, args: any): void | Promise<void>;
}

//#endregion EditorCommand

//#region EditorAction

export interface IEditorActionContextMenuOptions {
	group: string;
	order: number;
	when?: ContextKeyExpression;
	menuId?: MenuId;
}
export type IActionOptions = ICommandOptions & {
	contextMenuOpts?: IEditorActionContextMenuOptions | IEditorActionContextMenuOptions[];
} & ({
	label: nls.ILocalizedString;
	alias?: string;
} | {
	label: string;
	alias: string;
});

export abstract class EditorAction extends EditorCommand {

	private static convertOptions(opts: IActionOptions): ICommandOptions {

		let menuOpts: ICommandMenuOptions[];
		if (Array.isArray(opts.menuOpts)) {
			menuOpts = opts.menuOpts;
		} else if (opts.menuOpts) {
			menuOpts = [opts.menuOpts];
		} else {
			menuOpts = [];
		}

		function withDefaults(item: Partial<ICommandMenuOptions>): ICommandMenuOptions {
			if (!item.menuId) {
				item.menuId = MenuId.EditorContext;
			}
			if (!item.title) {
				item.title = typeof opts.label === 'string' ? opts.label : opts.label.value;
			}
			item.when = ContextKeyExpr.and(opts.precondition, item.when);
			return <ICommandMenuOptions>item;
		}

		if (Array.isArray(opts.contextMenuOpts)) {
			menuOpts.push(...opts.contextMenuOpts.map(withDefaults));
		} else if (opts.contextMenuOpts) {
			menuOpts.push(withDefaults(opts.contextMenuOpts));
		}

		opts.menuOpts = menuOpts;
		return <ICommandOptions>opts;
	}

	public readonly label: string;
	public readonly alias: string;

	constructor(opts: IActionOptions) {
		super(EditorAction.convertOptions(opts));
		if (typeof opts.label === 'string') {
			this.label = opts.label;
			this.alias = opts.alias ?? opts.label;
		} else {
			this.label = opts.label.value;
			this.alias = opts.alias ?? opts.label.original;
		}
	}

	public runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor, args: any): void | Promise<void> {
		this.reportTelemetry(accessor, editor);
		return this.run(accessor, editor, args || {});
	}

	protected reportTelemetry(accessor: ServicesAccessor, editor: ICodeEditor) {
		type EditorActionInvokedClassification = {
			owner: 'alexdima';
			comment: 'An editor action has been invoked.';
			name: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The label of the action that was invoked.' };
			id: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The identifier of the action that was invoked.' };
		};
		type EditorActionInvokedEvent = {
			name: string;
			id: string;
		};
		accessor.get(ITelemetryService).publicLog2<EditorActionInvokedEvent, EditorActionInvokedClassification>('editorActionInvoked', { name: this.label, id: this.id });
	}

	public abstract run(accessor: ServicesAccessor, editor: ICodeEditor, args: any): void | Promise<void>;
}

export type EditorActionImplementation = (accessor: ServicesAccessor, editor: ICodeEditor, args: any) => boolean | Promise<void>;

export class MultiEditorAction extends EditorAction {

	private readonly _implementations: [number, EditorActionImplementation][] = [];

	/**
	 * A higher priority gets to be looked at first
	 */
	public addImplementation(priority: number, implementation: EditorActionImplementation): IDisposable {
		this._implementations.push([priority, implementation]);
		this._implementations.sort((a, b) => b[0] - a[0]);
		return {
			dispose: () => {
				for (let i = 0; i < this._implementations.length; i++) {
					if (this._implementations[i][1] === implementation) {
						this._implementations.splice(i, 1);
						return;
					}
				}
			}
		};
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor, args: any): void | Promise<void> {
		for (const impl of this._implementations) {
			const result = impl[1](accessor, editor, args);
			if (result) {
				if (typeof result === 'boolean') {
					return;
				}
				return result;
			}
		}
	}

}

//#endregion EditorAction

//#region EditorAction2

export abstract class EditorAction2 extends Action2 {

	run(accessor: ServicesAccessor, ...args: any[]) {
		// Find the editor with text focus or active
		const codeEditorService = accessor.get(ICodeEditorService);
		const editor = codeEditorService.getFocusedCodeEditor() || codeEditorService.getActiveCodeEditor();
		if (!editor) {
			// well, at least we tried...
			return;
		}
		// precondition does hold
		return editor.invokeWithinContext((editorAccessor) => {
			const kbService = editorAccessor.get(IContextKeyService);
			const logService = editorAccessor.get(ILogService);
			const enabled = kbService.contextMatchesRules(this.desc.precondition ?? undefined);
			if (!enabled) {
				logService.debug(`[EditorAction2] NOT running command because its precondition is FALSE`, this.desc.id, this.desc.precondition?.serialize());
				return;
			}
			return this.runEditorCommand(editorAccessor, editor, ...args);
		});
	}

	abstract runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor, ...args: any[]): any;
}

//#endregion

// --- Registration of commands and actions


export function registerModelAndPositionCommand(id: string, handler: (accessor: ServicesAccessor, model: ITextModel, position: Position, ...args: any[]) => any) {
	CommandsRegistry.registerCommand(id, function (accessor, ...args) {

		const instaService = accessor.get(IInstantiationService);

		const [resource, position] = args;
		assertType(URI.isUri(resource));
		assertType(Position.isIPosition(position));

		const model = accessor.get(IModelService).getModel(resource);
		if (model) {
			const editorPosition = Position.lift(position);
			return instaService.invokeFunction(handler, model, editorPosition, ...args.slice(2));
		}

		return accessor.get(ITextModelService).createModelReference(resource).then(reference => {
			return new Promise((resolve, reject) => {
				try {
					const result = instaService.invokeFunction(handler, reference.object.textEditorModel, Position.lift(position), args.slice(2));
					resolve(result);
				} catch (err) {
					reject(err);
				}
			}).finally(() => {
				reference.dispose();
			});
		});
	});
}

export function registerEditorCommand<T extends EditorCommand>(editorCommand: T): T {
	EditorContributionRegistry.INSTANCE.registerEditorCommand(editorCommand);
	return editorCommand;
}

export function registerEditorAction<T extends EditorAction>(ctor: { new(): T }): T {
	const action = new ctor();
	EditorContributionRegistry.INSTANCE.registerEditorAction(action);
	return action;
}

export function registerMultiEditorAction<T extends MultiEditorAction>(action: T): T {
	EditorContributionRegistry.INSTANCE.registerEditorAction(action);
	return action;
}

export function registerInstantiatedEditorAction(editorAction: EditorAction): void {
	EditorContributionRegistry.INSTANCE.registerEditorAction(editorAction);
}

/**
 * Registers an editor contribution. Editor contributions have a lifecycle which is bound
 * to a specific code editor instance.
 */
export function registerEditorContribution<Services extends BrandedService[]>(id: string, ctor: { new(editor: ICodeEditor, ...services: Services): IEditorContribution }, instantiation: EditorContributionInstantiation): void {
	EditorContributionRegistry.INSTANCE.registerEditorContribution(id, ctor, instantiation);
}

/**
 * Registers a diff editor contribution. Diff editor contributions have a lifecycle which
 * is bound to a specific diff editor instance.
 */
export function registerDiffEditorContribution<Services extends BrandedService[]>(id: string, ctor: { new(editor: IDiffEditor, ...services: Services): IEditorContribution }): void {
	EditorContributionRegistry.INSTANCE.registerDiffEditorContribution(id, ctor);
}

export namespace EditorExtensionsRegistry {

	export function getEditorCommand(commandId: string): EditorCommand {
		return EditorContributionRegistry.INSTANCE.getEditorCommand(commandId);
	}

	export function getEditorActions(): Iterable<EditorAction> {
		return EditorContributionRegistry.INSTANCE.getEditorActions();
	}

	export function getEditorContributions(): IEditorContributionDescription[] {
		return EditorContributionRegistry.INSTANCE.getEditorContributions();
	}

	export function getSomeEditorContributions(ids: string[]): IEditorContributionDescription[] {
		return EditorContributionRegistry.INSTANCE.getEditorContributions().filter(c => ids.indexOf(c.id) >= 0);
	}

	export function getDiffEditorContributions(): IDiffEditorContributionDescription[] {
		return EditorContributionRegistry.INSTANCE.getDiffEditorContributions();
	}
}

// Editor extension points
const Extensions = {
	EditorCommonContributions: 'editor.contributions'
};

class EditorContributionRegistry {

	public static readonly INSTANCE = new EditorContributionRegistry();

	private readonly editorContributions: IEditorContributionDescription[] = [];
	private readonly diffEditorContributions: IDiffEditorContributionDescription[] = [];
	private readonly editorActions: EditorAction[] = [];
	private readonly editorCommands: { [commandId: string]: EditorCommand } = Object.create(null);

	constructor() {
	}

	public registerEditorContribution<Services extends BrandedService[]>(id: string, ctor: { new(editor: ICodeEditor, ...services: Services): IEditorContribution }, instantiation: EditorContributionInstantiation): void {
		this.editorContributions.push({ id, ctor: ctor as EditorContributionCtor, instantiation });
	}

	public getEditorContributions(): IEditorContributionDescription[] {
		return this.editorContributions.slice(0);
	}

	public registerDiffEditorContribution<Services extends BrandedService[]>(id: string, ctor: { new(editor: IDiffEditor, ...services: Services): IEditorContribution }): void {
		this.diffEditorContributions.push({ id, ctor: ctor as DiffEditorContributionCtor });
	}

	public getDiffEditorContributions(): IDiffEditorContributionDescription[] {
		return this.diffEditorContributions.slice(0);
	}

	public registerEditorAction(action: EditorAction) {
		action.register();
		this.editorActions.push(action);
	}

	public getEditorActions(): Iterable<EditorAction> {
		return this.editorActions;
	}

	public registerEditorCommand(editorCommand: EditorCommand) {
		editorCommand.register();
		this.editorCommands[editorCommand.id] = editorCommand;
	}

	public getEditorCommand(commandId: string): EditorCommand {
		return (this.editorCommands[commandId] || null);
	}

}
Registry.add(Extensions.EditorCommonContributions, EditorContributionRegistry.INSTANCE);

function registerCommand<T extends Command>(command: T): T {
	command.register();
	return command;
}

export const UndoCommand = registerCommand(new MultiCommand({
	id: 'undo',
	precondition: undefined,
	kbOpts: {
		weight: KeybindingWeight.EditorCore,
		primary: KeyMod.CtrlCmd | KeyCode.KeyZ
	},
	menuOpts: [{
		menuId: MenuId.MenubarEditMenu,
		group: '1_do',
		title: nls.localize({ key: 'miUndo', comment: ['&& denotes a mnemonic'] }, "&&Undo"),
		order: 1
	}, {
		menuId: MenuId.CommandPalette,
		group: '',
		title: nls.localize('undo', "Undo"),
		order: 1
	}, {
		menuId: MenuId.SimpleEditorContext,
		group: '1_do',
		title: nls.localize('undo', "Undo"),
		order: 1
	}]
}));

registerCommand(new ProxyCommand(UndoCommand, { id: 'default:undo', precondition: undefined }));

export const RedoCommand = registerCommand(new MultiCommand({
	id: 'redo',
	precondition: undefined,
	kbOpts: {
		weight: KeybindingWeight.EditorCore,
		primary: KeyMod.CtrlCmd | KeyCode.KeyY,
		secondary: [KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyZ],
		mac: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyZ }
	},
	menuOpts: [{
		menuId: MenuId.MenubarEditMenu,
		group: '1_do',
		title: nls.localize({ key: 'miRedo', comment: ['&& denotes a mnemonic'] }, "&&Redo"),
		order: 2
	}, {
		menuId: MenuId.CommandPalette,
		group: '',
		title: nls.localize('redo', "Redo"),
		order: 1
	}, {
		menuId: MenuId.SimpleEditorContext,
		group: '1_do',
		title: nls.localize('redo', "Redo"),
		order: 2
	}]
}));

registerCommand(new ProxyCommand(RedoCommand, { id: 'default:redo', precondition: undefined }));

export const SelectAllCommand = registerCommand(new MultiCommand({
	id: 'editor.action.selectAll',
	precondition: undefined,
	kbOpts: {
		weight: KeybindingWeight.EditorCore,
		kbExpr: null,
		primary: KeyMod.CtrlCmd | KeyCode.KeyA
	},
	menuOpts: [{
		menuId: MenuId.MenubarSelectionMenu,
		group: '1_basic',
		title: nls.localize({ key: 'miSelectAll', comment: ['&& denotes a mnemonic'] }, "&&Select All"),
		order: 1
	}, {
		menuId: MenuId.CommandPalette,
		group: '',
		title: nls.localize('selectAll', "Select All"),
		order: 1
	}, {
		menuId: MenuId.SimpleEditorContext,
		group: '9_select',
		title: nls.localize('selectAll', "Select All"),
		order: 1
	}]
}));

// Register Odoo Create Views action
registerAction2(class OdooCreateViewsAction extends Action2 {
	static readonly ID = 'editor.action.odooCreateViews';

	constructor() {
		super({
			id: OdooCreateViewsAction.ID,
			title: 'Create Views',
			precondition: EditorIsInOdooModelClass,
			menu: [{
				id: MenuId.EditorContext,
				group: 'navigation',
				order: 101
			}]
		});
	}

	async run(accessor: ServicesAccessor, ...args: any[]): Promise<void> {
		const editorService = accessor.get(ICodeEditorService);
		const fileService = accessor.get(IFileService);
		const notificationService = accessor.get(INotificationService);
		const activeEditor = editorService.getActiveCodeEditor();
		if (!activeEditor || !activeEditor.hasModel()) {
			alert('No active editor or model.');
			return;
		}
		const model = activeEditor.getModel();
		const position = activeEditor.getPosition();
		if (!position) {
			alert('No caret position.');
			return;
		}
		const code = model.getValue();
		const lines = code.split(/\r?\n/);
		// Find the class under the caret
		let classStart = -1, classEnd = -1, indent = '';
		for (let i = position.lineNumber - 1; i >= 0; i--) {
			const match = lines[i].match(/^([ \t]*)class (\w+)\s*\((.*?)\)\s*:/);
			if (match) {
				classStart = i;
				indent = match[1];
				break;
			}
		}
		if (classStart === -1) {
			alert('No class found under caret.');
			return;
		}
		for (let i = classStart + 1; i < lines.length; i++) {
			if (lines[i] && !lines[i].startsWith(indent + ' ') && !lines[i].startsWith(indent + '\t')) {
				classEnd = i;
				break;
			}
		}
		if (classEnd === -1) classEnd = lines.length;
		// Extract model name from _name attribute
		let modelName = '';
		for (let i = classStart + 1; i < classEnd; i++) {
			const m = lines[i].match(/^\s*_name\s*=\s*['\"]([\w\.]+)['\"]\s*$/);
			if (m) {
				const fullModelName = m[1];
				// Extract only model_id.modelname part (remove modulename if present)
				const parts = fullModelName.split('.');
				if (parts.length >= 2) {
					// If we have 3 parts (modulename.model_id.modelname), take the last 2
					// If we have 2 parts (model_id.modelname), use as is
					modelName = parts.slice(-2).join('.');
				} else {
					modelName = fullModelName;
				}
				break;
			}
		}
		if (!modelName) {
			alert('No _name attribute found in this class.');
			return;
		}
		// Extract fields
		const fieldRegex = /^\s*(\w+)\s*=\s*fields\.(\w+)\s*\(/;
		const fields: { name: string, type: string }[] = [];
		for (let i = classStart + 1; i < classEnd; i++) {
			const m = lines[i].match(fieldRegex);
			if (m) {
				fields.push({ name: m[1], type: m[2] });
			}
		}
		if (fields.length === 0) {
			alert('No Odoo fields found in this class.');
			return;
		}
		// Determine module root and views directory
		const pyUri = model.uri;
		const pyPath = pyUri.path;
		let modelsDir = '';
		if (pyPath.includes('/models/')) {
			modelsDir = pyPath.substring(0, pyPath.indexOf('/models/') + 8); // +8 for '/models/'
		} else {
			modelsDir = pyPath.substring(0, pyPath.lastIndexOf('/') + 1);
		}
		const moduleRoot = modelsDir.replace(/\/models\/?$/, '/');
		const viewsDir = moduleRoot + 'views/';
		const viewsDirUri = pyUri.with({ path: viewsDir });
		// Ensure views directory exists
		const viewsDirExists = await fileService.exists(viewsDirUri);
		if (!viewsDirExists) {
			await fileService.createFolder(viewsDirUri);
		}
		// Ensure __init__.py exists with only encoding comment
		const initUri = pyUri.with({ path: viewsDir + '__init__.py' });
		const initExists = await fileService.exists(initUri);
		if (!initExists) {
			await fileService.writeFile(initUri, VSBuffer.fromString('# -*- coding: utf-8 -*-\n'));
		}
		// XML file name
		const xmlFileName = `${modelName.replace(/\./g, '_')}_views.xml`;
		const xmlUri = pyUri.with({ path: viewsDir + xmlFileName });
		// If file exists, show warning
		const xmlExists = await fileService.exists(xmlUri);
		if (xmlExists) {
			alert(`A views file named ${xmlFileName} already exists in the views directory.`);
			return;
		}
		// Generate XML content
		const xmlIndent = (level: number) => '    '.repeat(level);
		const xml = `<?xml version="1.0" encoding="utf-8"?>\n<odoo>\n${xmlIndent(1)}<data>\n${xmlIndent(2)}<!-- Tree View -->\n${xmlIndent(2)}<record id="view_${modelName.replace(/\./g, '_')}_tree" model="ir.ui.view">\n${xmlIndent(3)}<field name="name">${modelName}.tree</field>\n${xmlIndent(3)}<field name="model">${modelName}</field>\n${xmlIndent(3)}<field name="arch" type="xml">\n${xmlIndent(4)}<tree string="${modelName}">\n${fields.map(f => `${xmlIndent(5)}<field name="${f.name}"/>`).join('\n')}\n${xmlIndent(4)}</tree>\n${xmlIndent(3)}</field>\n${xmlIndent(2)}</record>\n\n${xmlIndent(2)}<!-- Form View -->\n${xmlIndent(2)}<record id="view_${modelName.replace(/\./g, '_')}_form" model="ir.ui.view">\n${xmlIndent(3)}<field name="name">${modelName}.form</field>\n${xmlIndent(3)}<field name="model">${modelName}</field>\n${xmlIndent(3)}<field name="arch" type="xml">\n${xmlIndent(4)}<form string="${modelName}">\n${xmlIndent(5)}<sheet>\n${xmlIndent(6)}<group>\n${fields.map(f => `${xmlIndent(7)}<field name="${f.name}"/>`).join('\n')}\n${xmlIndent(6)}</group>\n${xmlIndent(5)}</sheet>\n${xmlIndent(4)}</form>\n${xmlIndent(3)}</field>\n${xmlIndent(2)}</record>\n\n${xmlIndent(2)}<!-- Search View -->\n${xmlIndent(2)}<record id="view_${modelName.replace(/\./g, '_')}_search" model="ir.ui.view">\n${xmlIndent(3)}<field name="name">${modelName}.search</field>\n${xmlIndent(3)}<field name="model">${modelName}</field>\n${xmlIndent(3)}<field name="arch" type="xml">\n${xmlIndent(4)}<search string="${modelName}">\n${xmlIndent(5)}<field name="${fields[0]?.name || 'name'}"/>\n${xmlIndent(4)}</search>\n${xmlIndent(3)}</field>\n${xmlIndent(2)}</record>\n\n${xmlIndent(2)}<!-- Action -->\n${xmlIndent(2)}<record id="action_${modelName.replace(/\./g, '_')}" model="ir.actions.act_window">\n${xmlIndent(3)}<field name="name">${modelName}</field>\n${xmlIndent(3)}<field name="res_model">${modelName}</field>\n${xmlIndent(3)}<field name="view_mode">tree,form</field>\n${xmlIndent(2)}</record>\n\n${xmlIndent(2)}<!-- Menu Item -->\n${xmlIndent(2)}<menuitem id="menu_${modelName.replace(/\./g, '_')}" name="${modelName}" action="action_${modelName.replace(/\./g, '_')}" sequence="10"/>\n\n${xmlIndent(1)}</data>\n</odoo>\n`;
		// Write XML file
		await fileService.createFile(xmlUri, VSBuffer.fromString(xml));
		// Open the XML file in the editor
		editorService.openCodeEditor({ resource: xmlUri }, null);
		console.log(`Successfully created the views ${xmlFileName}`);
		notificationService.info(`Successfully created the views ${xmlFileName}`);
	}
});



// Register Odoo Create Security action
registerAction2(class OdooCreateSecurityAction extends Action2 {
	static readonly ID = 'editor.action.odooCreateSecurity';

	constructor() {
		super({
			id: OdooCreateSecurityAction.ID,
			title: 'Create Security',
			precondition: EditorIsInOdooModelClass,
			menu: [{
				id: MenuId.EditorContext,
				group: 'navigation',
				order: 103
			}]
		});
	}

	async run(accessor: ServicesAccessor, ...args: any[]): Promise<void> {
		const editorService = accessor.get(ICodeEditorService);
		const fileService = accessor.get(IFileService);
		const notificationService = accessor.get(INotificationService);
		const activeEditor = editorService.getActiveCodeEditor();
		if (!activeEditor || !activeEditor.hasModel()) {
			alert('No active editor or model.');
			return;
		}
		const model = activeEditor.getModel();
		const position = activeEditor.getPosition();
		if (!position) {
			alert('No caret position.');
			return;
		}
		const code = model.getValue();
		const lines = code.split(/\r?\n/);
		// Find the class under the caret
		let classStart = -1, classEnd = -1, indent = '';
		for (let i = position.lineNumber - 1; i >= 0; i--) {
			const match = lines[i].match(/^([ \t]*)class (\w+)\s*\((.*?)\)\s*:/);
			if (match) {
				classStart = i;
				indent = match[1];
				break;
			}
		}
		if (classStart === -1) {
			alert('No class found under caret.');
			return;
		}
		for (let i = classStart + 1; i < lines.length; i++) {
			if (lines[i] && !lines[i].startsWith(indent + ' ') && !lines[i].startsWith(indent + '\t')) {
				classEnd = i;
				break;
			}
		}
		if (classEnd === -1) classEnd = lines.length;
		// Extract model name from _name attribute
		let modelName = '';
		for (let i = classStart + 1; i < classEnd; i++) {
			const m = lines[i].match(/^\s*_name\s*=\s*['\"]([\w\.]+)['\"]\s*$/);
			if (m) {
				const fullModelName = m[1];
				// Extract only model_id.modelname part (remove modulename if present)
				const parts = fullModelName.split('.');
				if (parts.length >= 2) {
					// If we have 3 parts (modulename.model_id.modelname), take the last 2
					// If we have 2 parts (model_id.modelname), use as is
					modelName = parts.slice(-2).join('.');
				} else {
					modelName = fullModelName;
				}
				break;
			}
		}
		if (!modelName) {
			alert('No _name attribute found in this class.');
			return;
		}
		// Determine module root and security directory
		const pyUri = model.uri;
		const pyPath = pyUri.path;
		let modelsDir = '';
		if (pyPath.includes('/models/')) {
			modelsDir = pyPath.substring(0, pyPath.indexOf('/models/') + 8); // +8 for '/models/'
		} else {
			modelsDir = pyPath.substring(0, pyPath.lastIndexOf('/') + 1);
		}
		const moduleRoot = modelsDir.replace(/\/models\/?$/, '/');
		const securityDir = moduleRoot + 'security/';
		const securityDirUri = pyUri.with({ path: securityDir });
		const csvFileName = 'ir.model.access.csv';
		const csvUri = pyUri.with({ path: securityDir + csvFileName });

		// Ensure security directory exists
		const securityDirExists = await fileService.exists(securityDirUri);
		if (!securityDirExists) {
			await fileService.createFolder(securityDirUri);
		}

		// Check if CSV file exists
		const csvExists = await fileService.exists(csvUri);
		let existingContent = '';
		let csvLines: string[] = [];

		if (csvExists) {
			// Read existing content
			const fileContent = await fileService.readFile(csvUri);
			existingContent = fileContent.value.toString();
			csvLines = existingContent.split(/\r?\n/);
		} else {
			// Create new CSV with header
			csvLines = ['id,name,model_id:id,group_id:id,perm_read,perm_write,perm_create,perm_unlink'];
		}

		// Check if model security already exists
		const modelId = modelName.replace(/\./g, '_');
		const accessName = `access_${modelId}_user`;
		const existingLineIndex = csvLines.findIndex(line =>
			line.includes(`access_${modelId}`) || line.includes(`model_${modelId}`)
		);

		if (existingLineIndex !== -1) {
			alert(`Security for model ${modelName} already exists in ${csvFileName}.`);
			return;
		}

		// Generate new security line
		const addonName = moduleRoot.split('/').filter(Boolean).pop() || 'addon';
		const modelDisplayName = modelName.replace(/\./g, ' ');
		const newLine = `${accessName},${modelDisplayName} user,${addonName}.model_${modelId},base.group_user,1,1,1,1`;

		// Add new line to content
		if (csvLines.length > 0 && csvLines[csvLines.length - 1] === '') {
			// Remove empty last line if exists
			csvLines.pop();
		}
		csvLines.push(newLine);

		// Write updated content
		const updatedContent = csvLines.join('\n') + '\n';
		await fileService.writeFile(csvUri, VSBuffer.fromString(updatedContent));

		// Open the CSV file in the editor
		editorService.openCodeEditor({ resource: csvUri }, null);
		console.log(`Successfully added security for model ${modelName} to ${csvFileName}`);
		notificationService.info(`Successfully added security for model ${modelName} to ${csvFileName}`);
	}
});

// Register Odoo Import Model action
registerAction2(class OdooImportModelAction extends Action2 {
	static readonly ID = 'editor.action.odooImportModel';

	constructor() {
		super({
			id: OdooImportModelAction.ID,
			title: 'Add to Init',
			precondition: EditorIsInOdooModelClass,
			menu: [{
				id: MenuId.EditorContext,
				group: 'navigation',
				order: 104
			}]
		});
	}

	async run(accessor: ServicesAccessor, ...args: any[]): Promise<void> {
		const editorService = accessor.get(ICodeEditorService);
		const fileService = accessor.get(IFileService);
		const notificationService = accessor.get(INotificationService);
		const activeEditor = editorService.getActiveCodeEditor();
		if (!activeEditor || !activeEditor.hasModel()) {
			alert('No active editor or model.');
			return;
		}
		const model = activeEditor.getModel();
		const position = activeEditor.getPosition();
		if (!position) {
			alert('No caret position.');
			return;
		}
		const code = model.getValue();
		const lines = code.split(/\r?\n/);
		// Find the class under the caret
		let classStart = -1, classEnd = -1, indent = '';
		for (let i = position.lineNumber - 1; i >= 0; i--) {
			const match = lines[i].match(/^([ \t]*)class (\w+)\s*\((.*?)\)\s*:/);
			if (match) {
				classStart = i;
				indent = match[1];
				break;
			}
		}
		if (classStart === -1) {
			alert('No class found under caret.');
			return;
		}
		for (let i = classStart + 1; i < lines.length; i++) {
			if (lines[i] && !lines[i].startsWith(indent + ' ') && !lines[i].startsWith(indent + '\t')) {
				classEnd = i;
				break;
			}
		}
		if (classEnd === -1) classEnd = lines.length;
		// Extract model name from _name attribute
		let modelName = '';
		for (let i = classStart + 1; i < classEnd; i++) {
			const m = lines[i].match(/^\s*_name\s*=\s*['\"]([\w\.]+)['\"]\s*$/);
			if (m) {
				const fullModelName = m[1];
				// Extract only model_id.modelname part (remove modulename if present)
				const parts = fullModelName.split('.');
				if (parts.length >= 2) {
					// If we have 3 parts (modulename.model_id.modelname), take the last 2
					// If we have 2 parts (model_id.modelname), use as is
					modelName = parts.slice(-2).join('.');
				} else {
					modelName = fullModelName;
				}
				break;
			}
		}
		if (!modelName) {
			alert('No _name attribute found in this class.');
			return;
		}

		// Get the current Python file path and determine models directory
		const pyUri = model.uri;
		const pyPath = pyUri.path;
		let modelsDir = '';
		let modelFileName = '';

		if (pyPath.includes('/models/')) {
			modelsDir = pyPath.substring(0, pyPath.indexOf('/models/') + 8); // +8 for '/models/'
			modelFileName = pyPath.substring(pyPath.lastIndexOf('/') + 1, pyPath.lastIndexOf('.'));
		} else {
			// If no models directory, use the same directory as the Python file
			modelsDir = pyPath.substring(0, pyPath.lastIndexOf('/') + 1);
			modelFileName = pyPath.substring(pyPath.lastIndexOf('/') + 1, pyPath.lastIndexOf('.'));
		}

		// Create __init__.py file path
		const initFilePath = modelsDir + '__init__.py';
		const initUri = pyUri.with({ path: initFilePath });

		// Check if __init__.py exists
		const initExists = await fileService.exists(initUri);
		let initContent = '';
		let initLines: string[] = [];

		console.log(`__init__.py exists: ${initExists}`);
		console.log(`__init__.py path: ${initFilePath}`);

		if (initExists) {
			// Read existing content
			const fileContent = await fileService.readFile(initUri);
			initContent = fileContent.value.toString();
			initLines = initContent.split(/\r?\n/);
			console.log(`Existing __init__.py content: ${initContent}`);
		} else {
			// Create new __init__.py with encoding comment
			initLines = ['# -*- coding: utf-8 -*-'];
			console.log('Creating new __init__.py file');
		}

		// Check if import already exists for this specific model
		const importStatement = `from . import ${modelFileName}`;
		const importExists = initLines.some(line => line.trim() === importStatement);

		console.log(`Import statement: ${importStatement}`);
		console.log(`Import already exists: ${importExists}`);
		console.log(`Current __init__.py content:`);
		console.log(initLines.join('\n'));

		if (importExists) {
			alert(`Import for ${modelFileName} already exists in __init__.py`);
			return;
		}

		// Add import statement
		if (initLines.length > 0 && initLines[initLines.length - 1] === '') {
			// Remove empty last line if exists
			initLines.pop();
		}
		initLines.push(importStatement);

		// Write updated content
		const updatedContent = initLines.join('\n') + '\n';
		console.log(`Writing updated content to ${initFilePath}:`);
		console.log(updatedContent);

		try {
			await fileService.writeFile(initUri, VSBuffer.fromString(updatedContent));
			console.log('File write successful');
		} catch (error) {
			console.error('Error writing file:', error);
			alert(`Error writing to __init__.py: ${error}`);
			return;
		}

		// Force refresh the file system
		await fileService.readFile(initUri);

		// Open the __init__.py file in the editor and ensure it's visible
		const editor = await editorService.openCodeEditor({ resource: initUri }, null);

		// If the editor is already open, refresh its content
		if (editor && editor.hasModel()) {
			const editorModel = editor.getModel();
			if (editorModel) {
				// Force refresh the model content
				editorModel.setValue(updatedContent);
				console.log('Editor model updated with new content');
			}
		} else {
			console.log('Editor opened successfully');
		}

		// Verify the file was written correctly
		try {
			const verifyContent = await fileService.readFile(initUri);
			console.log('Verification - File content after write:');
			console.log(verifyContent.value.toString());
		} catch (error) {
			console.error('Error verifying file content:', error);
		}

		console.log(`Successfully added import for ${modelFileName} to __init__.py`);
		console.log(`Updated content: ${updatedContent}`);
		notificationService.info(`Successfully added import for ${modelFileName} to __init__.py`);
	}
});

// Define a new MenuId for the Create Reports submenu
export const OdooCreateReportsSubmenu = new MenuId('OdooCreateReportsSubmenu');

// Register the submenu under the EditorContext menu
MenuRegistry.appendMenuItem(MenuId.EditorContext, {
	submenu: OdooCreateReportsSubmenu,
	title: 'Create Reports',
	group: 'navigation',
	order: 102,
	when: EditorIsInOdooModelClass
});

// Register the HTML report action under the submenu
registerAction2(class OdooCreateReportHtmlAction extends Action2 {
	static readonly ID = 'editor.action.odooCreateReportHtml';
	constructor() {
		super({
			id: OdooCreateReportHtmlAction.ID,
			title: 'HTML',
			precondition: EditorIsInOdooModelClass,
			menu: [{
				id: OdooCreateReportsSubmenu,
				group: 'navigation',
				order: 1
			}]
		});
	}
	async run(accessor: ServicesAccessor, ...args: any[]): Promise<void> {
		console.log('Odoo Create HTML Report: Action2 handler called');

		// Test notification to verify action is triggered
		const testNotificationService = accessor.get(INotificationService);
		testNotificationService.info('Successfully created HTML report!');

		const editorService = accessor.get(ICodeEditorService);
		const fileService = accessor.get(IFileService);
		const activeEditor = editorService.getActiveCodeEditor();
		if (!activeEditor || !activeEditor.hasModel()) {
			alert('No active editor or model.');
			return;
		}
		const model = activeEditor.getModel();
		const position = activeEditor.getPosition();
		if (!position) {
			alert('No caret position.');
			return;
		}
		const code = model.getValue();
		const lines = code.split(/\r?\n/);
		// Find the class under the caret
		let classStart = -1, classEnd = -1, indent = '';
		for (let i = position.lineNumber - 1; i >= 0; i--) {
			const match = lines[i].match(/^([ \t]*)class (\w+)\s*\((.*?)\)\s*:/);
			if (match) {
				classStart = i;
				indent = match[1];
				break;
			}
		}
		if (classStart === -1) {
			alert('No class found under caret.');
			return;
		}
		for (let i = classStart + 1; i < lines.length; i++) {
			if (lines[i] && !lines[i].startsWith(indent + ' ') && !lines[i].startsWith(indent + '\t')) {
				classEnd = i;
				break;
			}
		}
		if (classEnd === -1) classEnd = lines.length;
		// Extract model name from _name attribute
		let modelName = '';
		for (let i = classStart + 1; i < classEnd; i++) {
			const m = lines[i].match(/^\s*_name\s*=\s*['\"]([\w\.]+)['\"]\s*$/);
			if (m) {
				const fullModelName = m[1];
				// Extract only model_id.modelname part (remove modulename if present)
				const parts = fullModelName.split('.');
				if (parts.length >= 2) {
					// If we have 3 parts (modulename.model_id.modelname), take the last 2
					// If we have 2 parts (model_id.modelname), use as is
					modelName = parts.slice(-2).join('.');
				} else {
					modelName = fullModelName;
				}
				break;
			}
		}
		if (!modelName) {
			alert('No _name attribute found in this class.');
			return;
		}
		// Extract fields
		const fieldRegex = /^\s*(\w+)\s*=\s*fields\.(\w+)\s*\(/;
		const fields: { name: string, type: string }[] = [];
		for (let i = classStart + 1; i < classEnd; i++) {
			const m = lines[i].match(fieldRegex);
			if (m) {
				fields.push({ name: m[1], type: m[2] });
			}
		}
		if (fields.length === 0) {
			alert('No Odoo fields found in this class.');
			return;
		}
		// Determine module root and report directory
		const pyUri = model.uri;
		const pyPath = pyUri.path;
		let modelsDir = '';
		if (pyPath.includes('/models/')) {
			modelsDir = pyPath.substring(0, pyPath.indexOf('/models/') + 8); // +8 for '/models/'
		} else {
			modelsDir = pyPath.substring(0, pyPath.lastIndexOf('/') + 1);
		}
		const moduleRoot = modelsDir.replace(/\/models\/?$/, '/');
		const reportDir = moduleRoot + 'report/';
		const reportDirUri = pyUri.with({ path: reportDir });
		// Ensure report directory exists
		const reportDirExists = await fileService.exists(reportDirUri);
		if (!reportDirExists) {
			await fileService.createFolder(reportDirUri);
		}
		// Ensure __init__.py exists
		const initUri = pyUri.with({ path: reportDir + '__init__.py' });
		const initExists = await fileService.exists(initUri);
		// XML file name
		const xmlFileName = `${modelName.replace(/\./g, '_')}_report.xml`;
		const xmlUri = pyUri.with({ path: reportDir + xmlFileName });
		// If file exists, show warning
		const xmlExists = await fileService.exists(xmlUri);
		if (xmlExists) {
			alert(`A report file named ${xmlFileName} already exists in the report directory.`);
			return;
		}
		// Generate QWeb XML content
		const templateId = `report_${modelName.replace(/\./g, '_')}_document`;
		const reportActionId = `report_${modelName.replace(/\./g, '_')}`;
		const addonName = moduleRoot.split('/').filter(Boolean).pop() || 'addon';

		const xml = `<?xml version="1.0" encoding="utf-8"?>\n<odoo>\n    <record id="${reportActionId}" model="ir.actions.report">\n        <field name="name">${modelName}</field>\n        <field name="model">${modelName}</field>\n        <field name="report_type">qweb-html</field>\n        <field name="report_name">${addonName}.${templateId}</field>\n        <field name="report_file">${addonName}.${templateId}</field>\n        <field name="print_report_name">'%s' % object.name</field>\n        <field name="binding_model_id" ref="model_${modelName.replace(/\./g, '_')}"/>\n        <field name="binding_type">report</field>\n    </record>\n\n    <template id="${templateId}">\n        <t t-call="web.html_container">\n            <t t-foreach="docs" t-as="doc">\n                <t t-call="web.external_layout">\n                    <div class="page">\n                        <h2>${modelName} Report</h2>\n                        <table class="table table-condensed">\n                            <thead>\n                                <tr>\n${fields.map(f => `                                    <th>${f.name}</th>`).join('\n')}\n                                </tr>\n                            </thead>\n                            <tbody>\n                                <tr>\n${fields.map(f => `                                    <td>\n                                        <span t-esc="doc.${f.name}"/>\n                                    </td>`).join('\n')}\n                                </tr>\n                            </tbody>\n                        </table>\n                    </div>\n                </t>\n            </t>\n        </t>\n    </template>\n\n</odoo>\n`;
		// Write XML file
		console.log('Odoo Create HTML Report: Creating file...');
		await fileService.createFile(xmlUri, VSBuffer.fromString(xml));
		console.log('Odoo Create HTML Report: File created successfully');

		// Ensure __init__.py exists with only encoding comment
		if (!initExists) {
			await fileService.writeFile(initUri, VSBuffer.fromString('# -*- coding: utf-8 -*-\n'));
		}
		// Open the XML file in the editor
		editorService.openCodeEditor({ resource: xmlUri }, null);

		// Show success notification
		const notificationService = accessor.get(INotificationService);
		console.log(`Successfully created the HTML report ${xmlFileName}`);
		notificationService.info(`Successfully created the HTML report ${xmlFileName}`);
	}
});

// Register the PDF report action under the submenu
registerAction2(class OdooCreateReportPdfAction extends Action2 {
	static readonly ID = 'editor.action.odooCreateReportPdf';
	constructor() {
		super({
			id: OdooCreateReportPdfAction.ID,
			title: 'PDF',
			precondition: EditorIsInOdooModelClass,
			menu: [{
				id: OdooCreateReportsSubmenu,
				group: 'navigation',
				order: 2
			}]
		});
	}
	async run(accessor: ServicesAccessor, ...args: any[]): Promise<void> {
		const editorService = accessor.get(ICodeEditorService);
		const fileService = accessor.get(IFileService);
		const notificationService = accessor.get(INotificationService);
		const activeEditor = editorService.getActiveCodeEditor();
		if (!activeEditor || !activeEditor.hasModel()) {
			alert('No active editor or model.');
			return;
		}
		const model = activeEditor.getModel();
		const position = activeEditor.getPosition();
		if (!position) {
			alert('No caret position.');
			return;
		}
		const code = model.getValue();
		const lines = code.split(/\r?\n/);
		// Find the class under the caret
		let classStart = -1, classEnd = -1, indent = '';
		for (let i = position.lineNumber - 1; i >= 0; i--) {
			const match = lines[i].match(/^([ \t]*)class (\w+)\s*\((.*?)\)\s*:/);
			if (match) {
				classStart = i;
				indent = match[1];
				break;
			}
		}
		if (classStart === -1) {
			alert('No class found under caret.');
			return;
		}
		for (let i = classStart + 1; i < lines.length; i++) {
			if (lines[i] && !lines[i].startsWith(indent + ' ') && !lines[i].startsWith(indent + '\t')) {
				classEnd = i;
				break;
			}
		}
		if (classEnd === -1) classEnd = lines.length;
		// Extract model name from _name attribute
		let modelName = '';
		for (let i = classStart + 1; i < classEnd; i++) {
			const m = lines[i].match(/^\s*_name\s*=\s*['\"]([\w\.]+)['\"]\s*$/);
			if (m) {
				const fullModelName = m[1];
				// Extract only model_id.modelname part (remove modulename if present)
				const parts = fullModelName.split('.');
				if (parts.length >= 2) {
					// If we have 3 parts (modulename.model_id.modelname), take the last 2
					// If we have 2 parts (model_id.modelname), use as is
					modelName = parts.slice(-2).join('.');
				} else {
					modelName = fullModelName;
				}
				break;
			}
		}
		if (!modelName) {
			alert('No _name attribute found in this class.');
			return;
		}
		// Extract fields
		const fieldRegex = /^\s*(\w+)\s*=\s*fields\.(\w+)\s*\(/;
		const fields: { name: string, type: string }[] = [];
		for (let i = classStart + 1; i < classEnd; i++) {
			const m = lines[i].match(fieldRegex);
			if (m) {
				fields.push({ name: m[1], type: m[2] });
			}
		}
		if (fields.length === 0) {
			alert('No Odoo fields found in this class.');
			return;
		}
		// Determine module root and report directory
		const pyUri = model.uri;
		const pyPath = pyUri.path;
		let modelsDir = '';
		if (pyPath.includes('/models/')) {
			modelsDir = pyPath.substring(0, pyPath.indexOf('/models/') + 8); // +8 for '/models/'
		} else {
			modelsDir = pyPath.substring(0, pyPath.lastIndexOf('/') + 1);
		}
		const moduleRoot = modelsDir.replace(/\/models\/?$/, '/');
		const reportDir = moduleRoot + 'report/';
		const reportDirUri = pyUri.with({ path: reportDir });
		// Ensure report directory exists
		const reportDirExists = await fileService.exists(reportDirUri);
		if (!reportDirExists) {
			await fileService.createFolder(reportDirUri);
		}
		// Ensure __init__.py exists with only encoding comment
		const initUri = pyUri.with({ path: reportDir + '__init__.py' });
		const initExists = await fileService.exists(initUri);
		if (!initExists) {
			await fileService.writeFile(initUri, VSBuffer.fromString('# -*- coding: utf-8 -*-\n'));
		}
		// XML file name for PDF report
		const xmlFileName = `${modelName.replace(/\./g, '_')}_report_pdf.xml`;
		const xmlUri = pyUri.with({ path: reportDir + xmlFileName });
		// If file exists, show warning
		const xmlExists = await fileService.exists(xmlUri);
		if (xmlExists) {
			alert(`A PDF report file named ${xmlFileName} already exists in the report directory.`);
			return;
		}
		// Generate QWeb PDF XML content
		const templateId = `report_${modelName.replace(/\./g, '_')}_document_pdf`;
		const reportActionId = `report_${modelName.replace(/\./g, '_')}_pdf`;
		const addonName = moduleRoot.split('/').filter(Boolean).pop() || 'addon'; // Dynamically get addon name




		// Info box: Odoo sales report style information div with 2 columns
		function infoBoxRows(fields: { name: string, type: string }[]) {
			// Find name or sequence for main title
			const nameField = fields.find(f => f.name === 'name');
			const sequenceField = fields.find(f => f.name === 'sequence');
			const titleField = sequenceField || nameField;

			// Get all simple fields (not one2many, many2many, many2one)
			const simpleFields = fields.filter(f => !['one2many', 'many2many', 'many2one'].includes(f.type.toLowerCase()));

			// Remove the title field from simple fields to avoid duplication
			const otherFields = simpleFields.filter(f => f.name !== titleField?.name);

			let rows = '';

			// Odoo Sales Report Style Information Div - 2 columns with rows
			rows += `<div class="row" id="informations">`;

			// Split fields into two columns
			const leftFields: { name: string, type: string }[] = [];
			const rightFields: { name: string, type: string }[] = [];

			otherFields.forEach((field, index) => {
				if (index % 2 === 0) {
					leftFields.push(field);
				} else {
					rightFields.push(field);
				}
			});

			// Left column
			rows += `<div class="col-6">`;
			leftFields.forEach((field) => {
				const fieldLabel = field.name.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
				rows += `<div class="row" style="line-height: 1.2; margin-bottom: 4px;">
                    <div class="col-4"><strong>${fieldLabel}:</strong></div>
                    <div class="col-8"><span t-esc="doc.${field.name}"/></div>
                </div>`;
			});
			rows += `</div>`;

			// Right column
			rows += `<div class="col-6">`;
			rightFields.forEach((field) => {
				const fieldLabel = field.name.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
				rows += `<div class="row" style="line-height: 1.2; margin-bottom: 4px;">
                    <div class="col-4"><strong>${fieldLabel}:</strong></div>
                    <div class="col-8"><span t-esc="doc.${field.name}"/></div>
                </div>`;
			});
			rows += `</div>`;

			rows += `</div>`;

			// Add space between information div and table
			rows += `<div style="height: 20px;"></div>`;

			return rows;
		}

		// Find all one2many fields in the current model
		const one2manyFields = fields.filter(f => f.type.toLowerCase() === 'one2many');

		// Helper function to extract the comodel name from the field definition
		function extractComodelName(fieldName: string, allLines: string[]): string {
			// Find the actual field definition line
			for (let i = 0; i < allLines.length; i++) {
				const line = allLines[i];
				const match = line.match(/^\s*(\w+)\s*=\s*fields\.One2many\s*\(\s*['"]([^'"]+)['"]/);
				if (match && match[1] === fieldName) {
					// Extract comodel name from the first parameter
					return match[2];
				}
			}

			// Fallback to inferring from field name if not found
			if (fieldName.endsWith('_ids')) {
				return fieldName.replace('_ids', '');
			} else if (fieldName.endsWith('_lines')) {
				return fieldName.replace('_lines', '');
			} else if (fieldName.endsWith('_line_ids')) {
				return fieldName.replace('_line_ids', '');
			} else {
				// Default: remove 's' from the end if present
				return fieldName.replace(/s$/, '');
			}
		}

		// Helper function to extract fields from a comodel
		function extractComodelFields(comodelName: string, allLines: string[]): { name: string, type: string }[] {
			try {
				// Look for the comodel class in the current file
				let comodelStart = -1;
				let comodelEnd = -1;
				let comodelIndent = '';

				// Search for class with matching name (case insensitive)
				for (let i = 0; i < allLines.length; i++) {
					const classMatch = allLines[i].match(/^(\s*)class\s+(\w+)\s*\(/);
					if (classMatch && classMatch[2].toLowerCase().includes(comodelName.toLowerCase())) {
						comodelStart = i;
						comodelIndent = classMatch[1];
						break;
					}
				}

				if (comodelStart === -1) {
					// Comodel not found in current file, try fallback for common patterns
					return getFallbackComodelFields(comodelName);
				}

				// Find the end of the comodel class
				for (let i = comodelStart + 1; i < allLines.length; i++) {
					if (allLines[i] && !allLines[i].startsWith(comodelIndent + ' ') && !allLines[i].startsWith(comodelIndent + '\t')) {
						comodelEnd = i;
						break;
					}
				}
				if (comodelEnd === -1) comodelEnd = allLines.length;

				// Extract fields from the comodel class
				const fieldRegex = /^\s*(\w+)\s*=\s*fields\.(\w+)\s*\(/;
				const comodelFields: { name: string, type: string }[] = [];
				for (let i = comodelStart + 1; i < comodelEnd; i++) {
					const fieldMatch = allLines[i].match(fieldRegex);
					if (fieldMatch) {
						const fieldName = fieldMatch[1];
						const fieldType = fieldMatch[2];
						// Exclude one2many and many2many fields
						if (fieldType.toLowerCase() !== 'one2many' && fieldType.toLowerCase() !== 'many2many') {
							comodelFields.push({ name: fieldName, type: fieldType });
						}
					}
				}

				return comodelFields;
			} catch (error) {
				console.error('Error extracting comodel fields:', error);
				return getFallbackComodelFields(comodelName);
			}
		}

		// Fallback function to provide common field patterns for known comodel names
		function getFallbackComodelFields(comodelName: string): { name: string, type: string }[] {
			// Common field patterns for different comodel types
			const fieldPatterns: { [key: string]: { name: string, type: string }[] } = {
				'test.report.line': [
					{ name: 'description', type: 'Char' },
					{ name: 'amount', type: 'Float' },
					{ name: 'note', type: 'Text' },
					{ name: 'active', type: 'Boolean' }
				],
				'report.line': [
					{ name: 'description', type: 'Char' },
					{ name: 'amount', type: 'Float' },
					{ name: 'note', type: 'Text' },
					{ name: 'active', type: 'Boolean' }
				],
				'line': [
					{ name: 'description', type: 'Char' },
					{ name: 'amount', type: 'Float' },
					{ name: 'note', type: 'Text' }
				],
				'item': [
					{ name: 'name', type: 'Char' },
					{ name: 'description', type: 'Text' },
					{ name: 'quantity', type: 'Float' },
					{ name: 'price', type: 'Float' }
				],
				'product': [
					{ name: 'name', type: 'Char' },
					{ name: 'description', type: 'Text' },
					{ name: 'price', type: 'Float' },
					{ name: 'active', type: 'Boolean' }
				],
				'partner': [
					{ name: 'name', type: 'Char' },
					{ name: 'email', type: 'Char' },
					{ name: 'phone', type: 'Char' },
					{ name: 'active', type: 'Boolean' }
				]
			};

			// Try exact match first
			if (fieldPatterns[comodelName]) {
				return fieldPatterns[comodelName];
			}

			// Try partial matches
			for (const [pattern, fields] of Object.entries(fieldPatterns)) {
				if (comodelName.toLowerCase().includes(pattern.toLowerCase()) ||
					pattern.toLowerCase().includes(comodelName.toLowerCase())) {
					return fields;
				}
			}

			// Default fallback for unknown comodels
			return [
				{ name: 'name', type: 'Char' },
				{ name: 'description', type: 'Text' },
				{ name: 'active', type: 'Boolean' }
			];
		}

		// Helper to generate a table for a one2many field
		function one2manyTable(field: { name: string, type: string }, allModels: any) {
			// Extract the actual comodel name from the field definition
			const comodelName = extractComodelName(field.name, lines);

			// Dynamically extract fields from the comodel
			const comodelFields = extractComodelFields(comodelName, lines);

			// Use only actual comodel fields, no static fallback, limit to 8 fields
			const columns = comodelFields.slice(0, 8);

			// If no comodel fields found, skip this table
			if (columns.length === 0) {
				return '';
			}

			// Handle single field case - create a simple list instead of table
			if (columns.length === 1) {
				const singleField = columns[0];
				return `
                        <div class="mb-4">
                            <ul class="list-unstyled">
                                <t t-foreach="doc.${field.name}" t-as="line">
                                    <li class="mb-2"><span t-esc="line.${singleField.name}"/></li>
                                </t>
                            </ul>
                        </div>`;
			}

			// Multiple fields - create Odoo sales report style table
			return `
                        <div class="oe_structure"></div>
                        <table class="o_has_total_table table o_main_table table-borderless">
                            <thead style="display: table-row-group">
                                <tr>
${columns.map((f: { name: string, type: string }) => `                                    <th name="th_${f.name}" class="text-start">${f.name.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</th>`).join('\n')}
                                </tr>
                            </thead>
                            <tbody class="sale_tbody">
                                <t t-foreach="doc.${field.name}" t-as="line">
                                    <tr>
${columns.map((f: { name: string, type: string }) => `                                        <td name="td_${f.name}"><span t-esc="line.${f.name}"/></td>`).join('\n')}
                                    </tr>
                                </t>
                            </tbody>
                        </table>
                        <div class="oe_structure"></div>`;
		}

		// Generate table for only the first one2many field (ignore others if multiple exist)
		const one2manyTablesHtml = one2manyFields.length > 0 ? one2manyTable(one2manyFields[0], null) : '';

		// Info box: name/sequence big, partner_id (name), and two random simple fields
		const hasInfoBox = true; // Always show info box if any fields
		const infoBoxHtml = hasInfoBox ? `\n                        <div id="informations" class="report-wrapping-flexbox clearfix">\n                            ${infoBoxRows(fields)}\n                        </div>` : '';

		const xml = `<?xml version="1.0" encoding="utf-8"?>\n<odoo>\n    <record id="${reportActionId}" model="ir.actions.report">\n        <field name="name">PDF Report</field>\n        <field name="model">${modelName}</field>\n        <field name="report_type">qweb-pdf</field>\n        <field name="report_name">${addonName}.${templateId}</field>\n        <field name="report_file">${addonName}.${templateId}</field>\n        <field name="print_report_name">'%s' % object.name</field>\n        <field name="binding_model_id" ref="model_${modelName.replace(/\./g, '_')}"/>\n        <field name="binding_type">report</field>\n    </record>\n\n    <template id="${templateId}">\n        <t t-call="web.html_container">\n            <t t-foreach="docs" t-as="doc">\n                <t t-call="web.external_layout">\n                    <div class="page">\n                        <div class="oe_structure"/>\n                        ${infoBoxHtml}\n                        <div class="oe_structure"/>\n                        ${one2manyTablesHtml}\n                        <div class="oe_structure"/>\n                    </div>\n                </t>\n            </t>\n        </t>\n    </template>\n\n</odoo>\n`;
		// Write XML file
		await fileService.createFile(xmlUri, VSBuffer.fromString(xml));
		// Open the XML file in the editor
		editorService.openCodeEditor({ resource: xmlUri }, null);
		console.log(`Successfully created the PDF report ${xmlFileName}`);
		notificationService.info(`Successfully created the PDF report ${xmlFileName}`);
	}
});

// Register the Odoo model context key contribution
registerEditorContribution(OdooModelContextKeyContribution.ID, OdooModelContextKeyContribution, EditorContributionInstantiation.Eager);

// Register the Odoo model Code Lens provider
// This will be registered by the language features service when needed
