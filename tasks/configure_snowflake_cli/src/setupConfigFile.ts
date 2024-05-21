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

﻿import tl = require('azure-pipelines-task-lib');
import fs from 'fs';
import os from 'os';
import path from 'path';
import * as utils from './taskutil';

async function changePermissions(snowflakeConfigPath:string){
    if(utils.getPlatform() != utils.Platform.Windows)
    {
        fs.chmod(snowflakeConfigPath, 0o600, (err:any) => { if (err) throw err; });
    }
}

export async function setupConfigFile(configFilePath:string | undefined){
    try {
        if(configFilePath === undefined || configFilePath == "")
        {
            return;
        }

        const content: string = fs.readFileSync(configFilePath,'utf8');
        let snowflakeConfigPath = tl.getVariable(utils.CONFIG_TOML_FILE_OUTPUT_PATH) ?? path.join(os.homedir(), ".snowflake");
        utils.createDirectory(snowflakeConfigPath);
        snowflakeConfigPath = path.join(snowflakeConfigPath, "config.toml");
        console.log("Copying " + configFilePath + " to " + snowflakeConfigPath);
        fs.writeFileSync(snowflakeConfigPath, content, { flag: "w"});
        changePermissions(snowflakeConfigPath)
    }
    catch (err:any) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}