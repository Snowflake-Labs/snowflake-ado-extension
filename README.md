# Snowflake CLI Azure Devops

**Note:** Snowflake CLI Azure Devops is in early development phase. The project may change or be abandoned. Do not use for production use cases.


## Usage

Streamlines installing and using [Snowflake CLI](https://docs.snowflake.com/developer-guide/snowflake-cli-v2/index) in your CI/CD workflows. The CLI is installed in an isolated way, ensuring it won't conflict with your project dependencies. It automatically sets up the input config file within the `~/.snowflake/` directory.

This pipeline enables automation of your Snowflake CLI tasks, such as deploying Native Apps or running Snowpark scripts within your Snowflake environment.

## Parameters

### `cli-version`

The specified Snowflake CLI version. For example, `2.2.0`. If not specified, the latest version will be used.

### `default-config-file-path`

Path to the configuration file (`config.toml`) in your repository. The path must be relative to the root of your repository.

## How to Safely Configure the Pipeline

To set up Snowflake credentials for a specific connection, follow these steps:

1. **Add `config.toml` to Your Repository**:

   Create a `config.toml` file at the root of your repository with an empty connection configuration. For example:

   ```toml
   [connections]
   [connections.myconnection]
   user = ""
   database = ""
   ```

   This file serves as a template and should not include any sensitive credentials.

2. **Generate a Private Key**:

   Generate a key pair for your Snowflake account following this [user guide](https://docs.snowflake.com/en/user-guide/key-pair-auth).

3. **Store Credentials in Azure DevOps Pipeline Secrets**:

   Store each credential (e.g., account, private key, passphrase) in Azure DevOps Pipeline Secrets. Refer to the [Azure DevOps documentation](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/set-secret-variables?view=azure-devops&tabs=yaml%2Cbash#secret-variable-in-the-ui) for detailed instructions on how to create and manage secrets.

4. **Configure the Snowflake CLI Task**:

   Add the `default-config-file-path` parameter to the Snowflake CLI task in your pipeline YAML file. This specifies the path to your `config.toml` file. For example:

   ```yaml
   - task: SnowflakeCLI@1
     inputs:
       cliVersion: 'latest'
       defaultConfigFilePath: 'config.toml'
   ```

5. **Define the Commands to Execute**

   Specify the Snowflake CLI commands you want to run. Below is an example that checks the installed version of the CLI and tests the connection:

   ```yaml
   - script: |
       snow --version
       snow connection test
     env:
      ...
   ```

6. **Map Secrets to Environment Variables in your script**:

   Use envrionmental variables to map each secret. For example:

   ```yaml
   env:
     SNOWFLAKE_CONNECTIONS_MYCONNECTION_AUTHENTICATOR: 'SNOWFLAKE_JWT'
     SNOWFLAKE_CONNECTIONS_MYCONNECTION_PRIVATE_KEY_RAW: $(SNOWFLAKE_PRIVATE_KEY_RAW)
     SNOWFLAKE_CONNECTIONS_MYCONNECTION_ACCOUNT: $(SNOWFLAKE_ACCOUNT)
   ```

7. **[Optional] Set Up a Passphrase if Private Key is Encrypted**:

   Add an additional environment variable named `PRIVATE_KEY_PASSPHRASE` and set it to the private key passphrase. This passphrase will be used by Snowflake to decrypt the private key.

   ```yaml
     env:
       PRIVATE_KEY_PASSPHRASE: $(PASSPHRASE)  # Passphrase is only necessary if private key is encrypted.
   ```

8. **[Extra] Using Password Instead of Private Key**:

   Unset the environment variable `SNOWFLAKE_CONNECTIONS_MYCONNECTION_AUTHENTICATOR` and then add a new variable with the password as follows:

   ```yaml
   env:
     SNOWFLAKE_CONNECTIONS_MYCONNECTION_USER: $(SNOWFLAKE_USER)
     SNOWFLAKE_CONNECTIONS_MYCONNECTION_ACCOUNT: $(SNOWFLAKE_ACCOUNT)
     SNOWFLAKE_CONNECTIONS_MYCONNECTION_PASSWORD: $(SNOWFLAKE_PASSWORD)
   ```

9. **[Extra] Define config.toml Within the YAML File**:

You can create the config.toml file directly within your YAML pipeline using a shell command. Here’s how to do it:

   ```yaml
   - script: |
       cat <<EOF > config.toml
       default_connection_name = "myconnection" 
         
       [connections] 
       [connections.myconnection]
       user = ""
       EOF
     displayName: 'Create Sample File with Multiple Lines'
   ```

For more information on setting Snowflake credentials using environment variables, refer to the [Snowflake CLI documentation](https://docs.snowflake.com/en/developer-guide/snowflake-cli-v2/connecting/specify-credentials#how-to-use-environment-variables-for-snowflake-credentials).

## Full Example Usage

### Configuration File

```toml
default_connection_name = "myconnection"

[connections]
[connections.myconnection]
user = ""
```

### YAML Pipeline

```yaml
trigger:
- main

pool:
  vmImage: ubuntu-latest

steps:
- task: ConfigureSnowflakeCLI@0
  inputs:
    configFilePath: './config.toml'
    cliVersion: 'latest'
  displayName: SnowflakeCliTest

- script: |
    snow --version
    snow connection test
  env:
    SNOWFLAKE_CONNECTIONS_MYCONNECTION_AUTHENTICATOR: 'SNOWFLAKE_JWT'
    SNOWFLAKE_CONNECTIONS_MYCONNECTION_USER: $(SNOWFLAKE_USER)
    SNOWFLAKE_CONNECTIONS_MYCONNECTION_ACCOUNT: $(SNOWFLAKE_ACCOUNT)
    SNOWFLAKE_CONNECTIONS_MYCONNECTION_PRIVATE_KEY_RAW: $(SNOWFLAKE_PRIVATE_KEY_RAW)
    PRIVATE_KEY_PASSPHRASE: $(PASSPHRASE)  # Passphrase is only necessary if private key is encrypted.
```