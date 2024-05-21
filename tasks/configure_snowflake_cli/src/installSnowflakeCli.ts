import fs from 'fs';
import tl from 'azure-pipelines-task-lib';
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

async function installSnowflakeCliWithPipx(snowcliVersion:string | undefined){
    let result = undefined;
    
    if(snowcliVersion === undefined || snowcliVersion == "latest")
    {
        result = tl.execSync("pipx", "install snowflake-cli-labs --force");
    }
    else
    {
        result = tl.execSync("pipx", "install snowflake-cli-labs==" +snowcliVersion + " --force");
    }

    if(result !== undefined && result.code != 0){
        throw new Error("Error while installing snowflake-cli: " + result.stderr);
    }
}

export async function installSnowflakeCli(snowcliVersion:string | undefined){
    try {
        const disableSnowInstallation = tl.getVariable(utils.DISABLE_SNOW_INSTALLATION_WITH_PIPX);
        if (disableSnowInstallation === undefined || disableSnowInstallation == 'false')
        {
            installSnowflakeCliWithPipx(snowcliVersion);
        }

        addExecutableToPathVariable();
    
    }
    catch (err:any) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}
