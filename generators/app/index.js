const fs = require('fs/promises');
const Generator = require('yeoman-generator');

class AwsApiGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument("app", { type: String, required: true });
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
    const extensions = {
      "python": ".py",
      "typescript": ".ts",
      "javascript": ".js",
    };
     
    this.answers.extension = extensions[this.answers.language];
    const ignore = Object.values(extensions).filter(ext => ext != this.answers.extension).map(ext => `**/*${ext}.ejs`);

    await this.fs.copyTplAsync(
      this.templatePath('**/*.ejs'),
      this.destinationRoot(),
      this.answers, 
      {},
      { globOptions: { ignore } },
    );
  }
}

module.exports = AwsApiGenerator;

