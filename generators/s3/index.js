const { BaseGenerator, processDestinationPath, kebabCase } = require('../../common');

class S3Generator extends BaseGenerator {

  constructor(args, opts) {
    super(args, opts);

    this._input({ name: "name", type: 'input', validate: kebabCase });
    this._input({ name: "versioning", type: 'list', choices: ['yes', 'no'] });
    this._input({ name: "expiration", dataType: Number, type: 'input', default: 90 });
    this._input({ name: "transition", dataType: Number, type: 'input', default: 365 });
  }

  async create_api() {
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

module.exports = S3Generator;
