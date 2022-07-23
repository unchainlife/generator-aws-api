const { BaseGenerator, listVpcs, listSubnets } = require("../../common");

class SubnetGenerator extends BaseGenerator {

  constructor(args, opts) {
    super(args, opts);

    this._input({ name: 'vpc', type: 'list', choices: listVpcs(this.destinationRoot(), true) });
    this._input({ name: 'name', type: 'input' });
    this._input({ name: 'type', type: 'list', choices: ['public', 'private']})
    this._input({ name: 'cidr_block_offset', type: 'number', default: 0 })
  }

  async create_subnet() {
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

module.exports = SubnetGenerator;
