const { BaseGenerator, processDestinationPath, pascalCase, toKebabCase, kebabCase } = require('../../common');

class ApiGenerator extends BaseGenerator {

  constructor(args, opts) {
    super(args, opts);

    this._input({ name: 'name', type: 'input', validate: pascalCase });
  }

  async execute() {
    this.answers = await this._prompt();

    await this.fs.copyTplAsync(
      this.templatePath('**/*.ejs'),
      this.destinationRoot(),
      this.answers,
      {},
      {
        globOptions: { dot: true },
      }
    )
  }
}

module.exports = ApiGenerator;
