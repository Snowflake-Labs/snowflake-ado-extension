// Copyright 2024 Snowflake Inc. 
// SPDX-License-Identifier: Apache-2.0
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
// http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

﻿import * as task from 'azure-pipelines-task-lib';
import fs from 'fs';

// Enviroment variables names
export const PIPX_BIN_DIR = "PIPX_BIN_DIR";
export const CONFIG_TOML_FILE_OUTPUT_PATH = "CONFIG_TOML_FILE_OUTPUT_PATH";
export const SNOW_EXECUTABLE_OUTPUT_PATH = "SNOW_EXECUTABLE_OUTPUT_PATH";
export const DISABLE_SNOW_INSTALLATION_WITH_PIPX = "DISABLE_SNOW_INSTALLATION_WITH_PIPX";
export const SNOWFLAKE_PACKAGE_NAME = "snowflake-cli-labs";

export enum Platform {
    Windows,
    MacOS,
    Linux
}

export function getPlatform(): Platform {
    switch (process.platform) {
        case 'win32': return Platform.Windows;
        case 'darwin': return Platform.MacOS;
        case 'linux': return Platform.Linux;
        default: throw Error(task.loc('PlatformNotRecognized'));
    }
}

export function createDirectory(path:string){
    if (!fs.existsSync(path)){
        fs.mkdirSync(path, {recursive: true});
    }
}