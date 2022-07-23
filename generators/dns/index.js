const { BaseGenerator, processDestinationPath, domainName } = require('../../common');

class DnsGenerator extends BaseGenerator {

  constructor(args, opts) {
    super(args, opts);

    this._input({ name: "name", type: 'input',  validate: domainName });
  }

  async create() {
    let answers = await this._prompt();
    answers.safe_name = answers.name.replace(/\./g, "-");

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

module.exports = DnsGenerator;
