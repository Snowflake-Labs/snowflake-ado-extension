# Snowflake CLI Azure Devops

**Note:** Snowflake CLI Azure Devops is in early development phase. The project may change or be abandoned. Do not use for production use cases.

Streamlines installing and using [Snowflake CLI](https://docs.snowflake.com/developer-guide/snowflake-cli-v2/index) in your CI/CD workflows. The CLI is installed in isolated way making sure it won't conflict with dependencies of your project. And automatically set up the input config file within the ~/.snowflake/ directory.

In order to be used, it must be instaled from the extension menu.
The name is Configure Snowflake CLI

## Inputs

### `cliVersion`

The specified Snowflake CLI version. For example `2.1.0`.


### `configFilePath`

Path to the config.toml file in your repository. Should be relative to repository root.


## Example usage

```yaml
trigger:
- main

pool:
  vmImage: ubuntu-latest

steps:
- task: ConfigureSnowflakeCLI@0
  inputs:
    configFilePath: './config.toml'
    cliVersion: '2.1.1'
  displayName: SnowflakeCliTest

- script: snow connection test --debug
  displayName: 'Snow Version'
  env:
    SNOWFLAKE_CONNECTIONS_MYCONNECTION_ACCOUNT: $(SNOWFLAKE_ACCOUNT)
    SNOWFLAKE_CONNECTIONS_MYCONNECTION_PASSWORD: $(SNOWFLAKE_PASSWORD)
```