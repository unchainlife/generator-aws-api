const fs = require('fs/promises');
const { BaseGenerator, kebabCase, shortCode } = require("../../common");

class AppGenerator extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);

    this._input({ name: "project",              type: "input",  validate: shortCode, store: true });
    this._input({ name: "region",               type: "list",   choices: ["eu-west-2"], store: true });
    this._input({ name: "account_id",           type: "input" });
    this._input({ name: "account_aws_alias",    type: "input",  default: "mgmt" });
    this._input({ name: "account_cli_alias",    type: "input",  default: "mgmt" });
    this._input({ name: "account_role_name",    type: "input" });
    this._input({ name: "assume_dev_account",   type: "input", message: "dev account (multi-account only)", default: ({ account_id }) => account_id });
    this._input({ name: "assume_dev_role",      type: "input", message: "dev role (multi-account only)", default: ({ account_role_name }) => account_role_name });
    this._input({ name: "assume_test_account",  type: "input", message: "test account (multi-account only)", default: ({ account_id }) => account_id });
    this._input({ name: "assume_test_role",     type: "input", message: "test role (multi-account only)", default: ({ account_role_name }) => account_role_name });
    this._input({ name: "assume_prod_account",  type: "input", message: "prod account (multi-account only)", default: ({ account_id }) => account_id });
    this._input({ name: "assume_prod_role",     type: "input", message: "prod role (multi-account only)", default: ({ account_role_name }) => account_role_name });
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
