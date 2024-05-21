﻿import tl from 'azure-pipelines-task-lib';
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