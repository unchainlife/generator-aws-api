const fs = require('fs/promises');
const { BaseGenerator, kebabCase } = require("../../common");

class AwsApiGenerator extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);

    this._input({ name: "project", type: "input", validate: kebabCase, store: true });
    this._input({ name: "region", type: "list", choices: ["eu-west-2"], store: true });
    this._input({ name: "account_id", type: "input", store: true });
    this._input({ name: "account_alias", type: "input", default: "mgmt", store: true });
    this._input({ name: "cli_alias", type: "input", default: "mgmt", store: true });
    this._input({ name: "role", type: "input", store: true });
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
