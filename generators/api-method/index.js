const path = require('path');
const { BaseGenerator, kebabCase, vpcs, apis, apiResources, languages, languageRuntime, layers } = require("../../common");

class ApiGenerator extends BaseGenerator {

  constructor(args, opts) {
    super(args, opts);

    this._input({ name: 'vpc', type: 'list', choices: vpcs(this.destinationRoot()) });
    this._input({ name: 'api', type: 'list', choices: apis(this.destinationRoot()) });
    this._input({ name: 'resource', type: 'list', choices: apiResources(this.destinationRoot()) });
    this._input({ name: 'method', type: 'list', choices: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], default: 'GET' });
    this._input({ name: 'language', type: 'list', choices: languages(), default: 'javascript' });
    this._input({ name: 'layers', type: 'checkbox', choices: layers(this.destinationRoot()) });
  }

  async create_api() {
    let answers = await this._prompt();

    answers['runtime'] = languageRuntime(answers['language']);

    await this.fs.copyTplAsync(
      this.templatePath('all/**/*.*'),
      this.destinationRoot(),
      answers,
      {},
      { globOptions: { dot: true } },
    )
    await this.fs.copyTplAsync(
      this.templatePath(`${answers['language']}/**/*.*`),
      this.destinationRoot(),
      answers,
      {},
      { globOptions: { dot: true } },
    )
  }
}

module.exports = ApiGenerator;
