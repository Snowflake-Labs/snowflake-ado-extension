import tmrm from 'azure-pipelines-task-lib/mock-run';
import path from 'path';
import os from 'os';
import {TEMP_CONFIG_FILE_PATH, TEMP_EXEC_OUTPUT_PATH} from './constants'

const taskPath = path.join(__dirname, '..', '..', 'main.js');

const task: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);
process.env["CONFIG_TOML_FILE_OUTPUT_PATH"] = TEMP_CONFIG_FILE_PATH;
process.env["SNOW_EXECUTABLE_OUTPUT_PATH"] = TEMP_EXEC_OUTPUT_PATH;
process.env["DISABLE_SNOW_INSTALLATION_WITH_PIPX"] = 'true';

task.setInput('configFilePath', path.join(__dirname, 'testFiles', 'config.toml'));
task.setInput('snowcliVersion', '2.1.0');
task.run(true);