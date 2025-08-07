/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ICodeEditor } from '../browser/editorBrowser.js';
import { IEditorContribution } from '../common/editorCommon.js';
import { IContextKeyService, RawContextKey } from '../../platform/contextkey/common/contextkey.js';
import { IDisposable, DisposableStore } from '../../base/common/lifecycle.js';
import { IPosition } from '../common/core/position.js';
import { ITextModel } from '../common/model.js';
import { CodeLensProvider, CodeLens, Command } from '../common/languages.js';
import { Range } from '../common/core/range.js';
import { CancellationToken } from '../../base/common/cancellation.js';

export const EditorIsInOdooModelClass = new RawContextKey<boolean>('editorIsInOdooModelClass', false);

export class OdooModelContextKeyContribution implements IEditorContribution, IDisposable {
	public static readonly ID = 'editor.contrib.odooModelContextKey';
	private readonly _disposables = new DisposableStore();
	private readonly _contextKey: { set(value: boolean): void };
	private _editor: ICodeEditor;

	constructor(editor: ICodeEditor, @IContextKeyService contextKeyService: IContextKeyService) {
		this._editor = editor;
		this._contextKey = EditorIsInOdooModelClass.bindTo(contextKeyService);

		this._disposables.add(
			this._editor.onDidChangeCursorPosition(() => this._updateContextKey())
		);
		this._disposables.add(
			this._editor.onDidChangeModel(() => this._updateContextKey())
		);
		this._disposables.add(
			this._editor.onDidChangeModelContent(() => this._updateContextKey())
		);

		this._updateContextKey();
	}

	private _updateContextKey() {
		const model = this._editor.getModel();
		if (!model || model.getLanguageId() !== 'python') {
			console.log('Odoo Model Context Key: FALSE - Not a Python file or no model');
			this._contextKey.set(false);
			return;
		}

		const position = this._editor.getPosition();
		if (!position) {
			console.log('Odoo Model Context Key: FALSE - No position');
			this._contextKey.set(false);
			return;
		}

		console.log(`Odoo Model Context Key: Checking position ${position.lineNumber}:${position.column} in Python file`);
		const isInOdooClass = this._isCaretInOdooModelClass(model, position);
		this._contextKey.set(isInOdooClass);

		// Debug logging
		if (isInOdooClass) {
			console.log('Odoo Model Context Key: TRUE - Caret is in Odoo model class');
		} else {
			console.log('Odoo Model Context Key: FALSE - Caret is not in Odoo model class');
		}
	}

	private _isCaretInOdooModelClass(model: ITextModel, position: IPosition): boolean {
		const lineCount = model.getLineCount();
		let currentClassStart = -1;
		let currentClassIndent = 0;
		let foundOdooAttr = false;

		console.log(`Odoo Model Context Key: Scanning ${lineCount} lines for Odoo model class`);

		// Scan from the beginning to find the class containing the caret
		for (let line = 1; line <= lineCount; ++line) {
			const text = model.getLineContent(line);
			const trimmedText = text.trim();

			// Check for class definition (more robust regex)
			const classMatch = /^class\s+(\w+)/.exec(trimmedText);
			if (classMatch) {
				const indent = text.length - text.trimStart().length;
				console.log(`Odoo Model Context Key: Found class '${classMatch[1]}' at line ${line} with indent ${indent}`);

				// If we're at or before the caret position, this could be our class
				if (line <= position.lineNumber) {
					currentClassStart = line;
					currentClassIndent = indent;
					foundOdooAttr = false;
					console.log(`Odoo Model Context Key: Set current class to '${classMatch[1]}' starting at line ${line}`);
				} else if (indent <= currentClassIndent && currentClassStart !== -1) {
					// We've found a class at the same or lower indent level,
					// which means we've left the current class
					if (position.lineNumber < line) {
						console.log(`Odoo Model Context Key: Left current class at line ${line}`);
						break;
					}
				}
			}

			// Check for Odoo attributes within the current class
			if (currentClassStart !== -1 && line >= currentClassStart && line <= position.lineNumber) {
				if (/\b(_name|_inherit)\s*=\s*['"`]/.test(text)) {
					foundOdooAttr = true;
					console.log(`Odoo Model Context Key: Found Odoo attribute at line ${line}: ${trimmedText}`);
				}
			}

			// If we've reached the caret position and we're in a class with Odoo attributes, we're done
			if (line === position.lineNumber && currentClassStart !== -1 && foundOdooAttr) {
				console.log(`Odoo Model Context Key: SUCCESS - Caret at line ${line} is in Odoo model class`);
				return true;
			}
		}

		console.log(`Odoo Model Context Key: FAILED - Caret not in Odoo model class (currentClassStart: ${currentClassStart}, foundOdooAttr: ${foundOdooAttr})`);
		return false;
	}

	dispose() {
		this._disposables.dispose();
	}
}

// Code Lens Provider for Odoo Models
export class OdooModelCodeLensProvider implements CodeLensProvider {
	static readonly ID = 'odooModelCodeLensProvider';

	provideCodeLenses(model: ITextModel, token: CancellationToken): { lenses: CodeLens[] } | undefined {
		if (model.getLanguageId() !== 'python') {
			return { lenses: [] };
		}

		const codeLenses: CodeLens[] = [];
		const lines = model.getLinesContent();

		for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
			const line = lines[lineNumber];
			const trimmedLine = line.trim();

			// Check for class definition
			const classMatch = /^class\s+(\w+)/.exec(trimmedLine);
			if (classMatch) {

				// Check if this class has Odoo attributes
				const hasOdooAttributes = this._hasOdooAttributes(model, lineNumber);

				if (hasOdooAttributes) {
					// Create Code Lens for Odoo model
					const range = new Range(lineNumber + 1, 1, lineNumber + 1, 1);

					// Create Views Code Lens
					const createViewsCommand: Command = {
						id: 'editor.action.odooCreateViews',
						title: '$(file-code) Create Views',
						arguments: []
					};
					codeLenses.push({ range, command: createViewsCommand });



					// Create Security Code Lens
					const createSecurityCommand: Command = {
						id: 'editor.action.odooCreateSecurity',
						title: '$(shield) Create Security',
						arguments: []
					};
					codeLenses.push({ range, command: createSecurityCommand });
				}
			}
		}

		return { lenses: codeLenses };
	}

	private _hasOdooAttributes(model: ITextModel, classLineNumber: number): boolean {
		const lines = model.getLinesContent();
		const classLine = lines[classLineNumber];
		const classIndent = classLine.length - classLine.trimStart().length;

		// Check lines after the class definition
		for (let i = classLineNumber + 1; i < lines.length; i++) {
			const line = lines[i];
			const lineIndent = line.length - line.trimStart().length;

			// If we've reached a line with same or less indent, we've left the class
			if (lineIndent <= classIndent && line.trim() !== '') {
				break;
			}

			// Check for Odoo attributes
			if (/\b(_name|_inherit)\s*=\s*['"`]/.test(line)) {
				return true;
			}
		}

		return false;
	}
}
