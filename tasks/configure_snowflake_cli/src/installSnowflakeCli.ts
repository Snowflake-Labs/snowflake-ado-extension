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

﻿import fs from 'fs';
import tl = require('azure-pipelines-task-lib');
import * as utils from './taskutil';
import path from 'path';

/**
 * This function ensures that each time `snow` command is executed the system will use 
 * the executable installed using the Snowflake CLI task.
 */
async function addExecutableToPathVariable(){
    const pipx_bin_path = tl.getVariable(utils.PIPX_BIN_DIR);
    if(pipx_bin_path === undefined)
    {
        throw new Error('Error environment variable PIPX_BIN_DIR not set');
    }

    const snowExecutableName = utils.getPlatform() == utils.Platform.Windows? "snow.exe" : "snow";
    const previous_snow_directory_path = path.join(pipx_bin_path, snowExecutableName);
    const new_snow_directory_path = tl.getVariable(utils.SNOW_EXECUTABLE_OUTPUT_PATH) ?? path.join(pipx_bin_path, 'snow_pipx_path');
    utils.createDirectory(new_snow_directory_path);
    const new_snow_executable_path = path.join(new_snow_directory_path, snowExecutableName);
    fs.copyFileSync(
        previous_snow_directory_path,
        new_snow_executable_path
        );
    
    tl.prependPath(new_snow_directory_path);
}

async function installSnowflakeCliWithPipx(cliVersion:string | undefined){
    let result = undefined;
    
    if(cliVersion === undefined || cliVersion == "latest")
    {
        result = tl.execSync("pipx", `install ${utils.SNOWFLAKE_PACKAGE_NAME} --force`);
    }
    else
    {
        result = tl.execSync("pipx", `install ${utils.SNOWFLAKE_PACKAGE_NAME}==${cliVersion} --force`);
    }

    if(result !== undefined && result.code != 0){
        throw new Error("Error while installing snowflake-cli: " + result.stderr);
    }
}

export async function installSnowflakeCli(cliVersion:string | undefined){
    try {
        const disableSnowInstallation = tl.getVariable(utils.DISABLE_SNOW_INSTALLATION_WITH_PIPX);
        if (disableSnowInstallation === undefined || disableSnowInstallation == 'false')
        {
            installSnowflakeCliWithPipx(cliVersion);
        }

        addExecutableToPathVariable();
    
    }
    catch (err:any) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}
