const fs = require('fs/promises');
const Generator = require('yeoman-generator');

class AwsApiGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  async core_application() {
    this.answers = await this.prompt([
      {
        name: "project",
        type: "input",
        default: "MyProject",
      },
      {
        name: "language",
        type: "list",
        choices: [
          "python",
          "typescript",
          "javascript"
        ],
        store: true,
      }
    ]);

    await this.fs.copyTplAsync(
      this.templatePath('**/*.ejs'),
      this.destinationPath(),
      this.answers
    );
  }
}

module.exports = AwsApiGenerator;

