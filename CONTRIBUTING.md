# Contributing to the Project

## Setting development environment

To get started with the project, you'll need to install the necessary dependencies. You can do this these commands running:

`cd tasks/configure_snowflake_cli && npm run install:dev`

## Running Tests

To test your changes, run the following command in `tasks/configure_snowflake_cli` folder :

`npm run test`

## Creating a Release

To create a release follow these steps:

1. Update the vss-extension.json and tasks/configure_snowflake_cli/task.json files with the new version number.
2. Run the following command in `tasks/configure_snowflake_cli` directory to create the extension package:



`npx run create:extension`

This command executes a `git clean -xdf` and install only the required dependencies, to run tests start from the first section again.


For futher information in package and publish the extension you can go to: [package and publish extensions](https://learn.microsoft.com/en-us/azure/devops/extend/publish/overview?toc=%2Fazure%2Fdevops%2Fmarketplace-extensibility%2Ftoc.json&view=azure-devops)