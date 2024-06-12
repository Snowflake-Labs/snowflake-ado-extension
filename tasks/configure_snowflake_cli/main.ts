import tl = require('azure-pipelines-task-lib');
import path from 'path';
import * as task from 'azure-pipelines-task-lib';
import { setupConfigFile } from './src/setupConfigFile';
import { installSnowflakeCli } from './src/installSnowflakeCli';

async function run() {
    try {
        task.setResourcePath(path.join(__dirname, 'task.json'));
        const configFilePath: string | undefined = tl.getInput('configFilePath', false);
        const cliVersion: string | undefined = tl.getInput('cliVersion', false);
        installSnowflakeCli(cliVersion);
        setupConfigFile(configFilePath);
    }
    catch (err:any) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();