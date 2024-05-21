import tl from 'azure-pipelines-task-lib';
import path from 'path';
import * as task from 'azure-pipelines-task-lib';
import { setupConfigFile } from './src/setupConfigFile';
import { installSnowflakeCli } from './src/installSnowflakeCli';

async function run() {
    try {
        task.setResourcePath(path.join(__dirname, 'task.json'));
        const configFilePath: string | undefined = tl.getInput('configFilePath', false);
        const snowcliVersion: string | undefined = tl.getInput('snowcliVersion', false);
        installSnowflakeCli(snowcliVersion);
        setupConfigFile(configFilePath);
    }
    catch (err:any) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();