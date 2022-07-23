const { BaseGenerator, processDestinationPath, domainName, listZones, listApis } = require('../../common');

class ApiDnsGenerator extends BaseGenerator {

  constructor(args, opts) {
    super(args, opts);

    this._input({ name: "api", type: 'list', choices: listApis(this.destinationRoot()) });
    this._input({ name: "zone", type: 'list', choices: listZones(this.destinationRoot()) });
    this._input({ name: 'subdomain', type: 'input' });
    this._input({ name: 'base_path', type: 'input' });
  }

  async create() {
    let answers = await this._prompt();
    const { zone, subdomain } = answers;
    answers.safe_name = subdomain.replace(/\./g, "-") + "-" + zone;

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

module.exports = ApiDnsGenerator;
