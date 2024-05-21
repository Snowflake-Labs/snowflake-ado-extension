import * as path from 'path';
import * as assert from 'assert';
import fs from 'fs';
import * as ttm from 'azure-pipelines-task-lib/mock-test';
import {TEMP_CONFIG_FILE_PATH, TEMP_EXEC_OUTPUT_PATH} from './constants'


describe('Snowflake Cli configuration', function () {

    afterEach(() => {
        if (fs.existsSync(path.join(__dirname, 'temp'))){
            fs.rmSync(path.join(__dirname, 'temp'), { recursive: true, force: true });
        }
    });

    it('should configure files', function(done: Mocha.Done) {    
        const tp: string = path.join(__dirname, 'successSample.js');
        const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
    
        tr.runAsync().then(async () => {
            const test = require ('node:test');

            console.log(tr.succeeded);
            assert.equal(tr.succeeded, true, 'should have succeeded');
            assert.equal(tr.warningIssues.length, 0, "should have no warnings");
            assert.equal(tr.errorIssues.length, 0, "should have no errors");
            
            const snowflakeConfigPath =  path.join(TEMP_CONFIG_FILE_PATH, "config.toml");
            const newExecutablePath =  path.join(TEMP_EXEC_OUTPUT_PATH, 'snow');

            await test('Should display prepend command', () => {
                assert.equal(tr.stdout.indexOf(`##vso[task.prependpath]${TEMP_EXEC_OUTPUT_PATH}`) >= 0, true, "should display prepend command");
            })

            const content: string = fs.readFileSync(snowflakeConfigPath,'utf8');

            await test('Output config.toml file should contain demo_user', () => {
                assert.equal(content.indexOf('user = "demo_user"') >= 0, true, 'should contain demo_user');
            })

            await test('File should be installed in output path', () => {
                assert.equal(fs.existsSync(newExecutablePath), true, 'File should be installed');
            })

            done();
        }).catch((error) => {
            done(error);
        });
    });    

    it('should fail configuring config.toml file', function(done: Mocha.Done) {    
        const tp: string = path.join(__dirname, 'configFileNotFoundSample.js');
        const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
    
        tr.runAsync().then(async () => {
            const test = require ('node:test');
            assert.equal(tr.succeeded, false, 'should have not succeeded');
            assert.equal(tr.warningIssues.length, 0, "should have no warnings");
            assert.equal(tr.errorIssues.length, 1, "should one error");
            assert.match(tr.errorIssues[0], new RegExp('no such file or directory'), 'file should not exists');

            done();
        }).catch((error) => {
            done(error);
        });
    });

    it('should fail if PIPX_BIN_DIR is not set', function(done: Mocha.Done) {    
        const tp: string = path.join(__dirname, 'PipxBinDirNotSetSample.js');
        const tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
    
        tr.runAsync().then(async () => {
            const test = require ('node:test');
            assert.equal(tr.succeeded, false, 'should have not succeeded');
            assert.equal(tr.warningIssues.length, 0, "should have no warnings");
            assert.equal(tr.errorIssues.length, 2, "should one error");
            assert.match(tr.errorIssues[0], new RegExp('Error environment variable PIPX_BIN_DIR'), 'PIPX_BIN_DIR is defined');

            done();
        }).catch((error) => {
            done(error);
        });
    });    
});