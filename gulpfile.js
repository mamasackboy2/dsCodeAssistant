/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *  
 *  Gulpfile Entry Point - Last updated: 2025-10-30
 *  This file serves as the main entry point for Gulp build tasks
 *--------------------------------------------------------------------------------------------*/

/**
 * @fileoverview Main gulpfile entry point that imports and executes the build tasks
 * @author Microsoft Corporation
 */

import { createRequire } from 'node:module';

/**
 * Create a require function compatible with ES modules
 * This allows us to import CommonJS modules in an ESM context
 */
const require = createRequire(import.meta.url);

/**
 * Import and execute the main gulpfile
 * All build tasks are defined in ./build/gulpfile
 */
require('./build/gulpfile');
