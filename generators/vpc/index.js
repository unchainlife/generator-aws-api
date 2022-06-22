const { BaseGenerator, vpcs } = require("../../common");

class VpcGenerator extends BaseGenerator {

  constructor(args, opts) {
    super(args, opts);

    this._input({ name: 'vpc', type: 'input' });
    this._input({ name: 'cidr', type: 'input', default: '10.0.0.0/16' })
    this._input({ name: 'availability_zones', type: 'checkbox', choices: ['eu-west-2a', 'eu-west-2b', 'eu-west-2c']})
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

module.exports = VpcGenerator;
