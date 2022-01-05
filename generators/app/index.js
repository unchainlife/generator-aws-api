const fs = require('fs/promises');
const Generator = require('yeoman-generator');
const { pascalCase } = require("../../common");

class AwsApiGenerator extends Generator {
  // constructor(args, opts) {
  //   super(args, opts);
  // }

  async core_application() {
    this.answers = await this.prompt([
      {
        name: "project",
        type: "input",
        default: "MyProject",
        validate: pascalCase,
      },
      {
        name: "region",
        type: "list",
        choices: ["eu-west-2"]
      }
    ]);

    await this.fs.copyTplAsync(
      this.templatePath('**/*'),
      this.destinationRoot(),
      this.answers,
      {},
      { globOptions: { dot: true } },
    );
  }
}

module.exports = AwsApiGenerator;

