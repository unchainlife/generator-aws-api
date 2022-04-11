const { BaseGenerator, vpcs } = require("../../common");

class ApiGenerator extends BaseGenerator {

  constructor(args, opts) {
    super(args, opts);

    this._input({ name: 'vpc', type: 'list', choices: vpc() });
  }

  async create_vpc() {
    let answers = await this._prompt();

    await this.fs.copyTplAsync(
      this.templatePath('**/*.*'),
      this.destinationRoot(),
      answers,
      {},
      { globOptions: { dot: true } },
    )
  }
}

module.exports = ApiGenerator;
