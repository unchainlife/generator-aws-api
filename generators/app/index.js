const fs = require('fs/promises');
const { BaseGenerator, pascalCase } = require("../../common");

class AwsApiGenerator extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);

    this._input({ name: "project", type: "input", validate: pascalCase });
    this._input({ name: "region", type: "list", choices: ["eu-west-2"]});
  }

  async core_application() {
    let state = await this._prompt();

    await this.fs.copyTplAsync(
      this.templatePath('**/*'),
      this.destinationRoot(),
      state,
      {},
      { globOptions: { dot: true } },
    );
  }
}

module.exports = AwsApiGenerator;
