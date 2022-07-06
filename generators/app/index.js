const fs = require('fs/promises');
const { BaseGenerator, kebabCase } = require("../../common");

class AppGenerator extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);

    this._input({ name: "project", type: "input", validate: kebabCase, store: true });
    this._input({ name: "region", type: "list", choices: ["eu-west-2"], store: true });
    this._input({ name: "account_id", type: "input" });
    this._input({ name: "account_aws_alias", type: "input", default: "mgmt" });
    this._input({ name: "account_cli_alias", type: "input", default: "mgmt" });
    this._input({ name: "account_role_name", type: "input" });
    this._input({ name: "dev_account_id", type: "input" });
    this._input({ name: "test_account_id", type: "input" });
    this._input({ name: "prod_account_id", type: "input" });
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

    this.config.save();
  }
}

module.exports = AppGenerator;
