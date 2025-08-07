/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerEditorFeature } from '../common/editorFeatures.js';
import { OdooModelCodeLensProvider } from './odooModelContext.js';

// Register the Odoo Code Lens provider
registerEditorFeature(OdooModelCodeLensProvider);
