const { BaseGenerator, processDestinationPath, or, nullable, kebabCase } = require('../../common');

const BILLING_MODES = ['PROVISIONED', 'PAY_PER_REQUEST'];

class KmsKeyGenerator extends BaseGenerator {

  constructor(args, opts) {
    super(args, opts);

    this._input({ name: "name", type: 'input',  validate: kebabCase });
    this._input({ name: "description", type: 'input' });
  }

  async create() {
    let answers = await this._prompt();

    await this.fs.copyTplAsync(
      this.templatePath('**/*.ejs'),
      this.destinationRoot(),
      answers,
      {},
      {
        globOptions: { dot: true },
      }
    )
  }
}

module.exports = KmsKeyGenerator;
