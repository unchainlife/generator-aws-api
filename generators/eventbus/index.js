const { BaseGenerator, processDestinationPath, toKebabCase, kebabCase } = require('../../common');

class ApiGenerator extends BaseGenerator {

  constructor(args, opts) {
    super(args, opts);

    this._input({ name: 'name', type: 'input', validate: kebabCase });
  }

  async execute() {
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

module.exports = ApiGenerator;
