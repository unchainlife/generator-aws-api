const { BaseGenerator, processDestinationPath, pascalCase } = require('../../common');

class ApiGenerator extends BaseGenerator {

  constructor(args, opts) {
    super(args, opts);

    this._input({ name: "name", type: 'input', validate: pascalCase })
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

module.exports = ApiGenerator;
