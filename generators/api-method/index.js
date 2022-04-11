const { BaseGenerator, pascalCase, vpcs, apis, apiResources, languages, languageRuntime, languageIgnorePattern } = require("../../common");

class ApiGenerator extends BaseGenerator {

  constructor(args, opts) {
    super(args, opts);

    this._input({ name: 'vpc', type: 'list', choices: vpcs(this.destinationRoot()) });
    this._input({ name: 'api', type: 'list', choices: apis(this.destinationRoot()) });
    this._input({ name: 'resource', type: 'list', choices: apiResources(this.destinationRoot()) });
    this._input({ name: 'method', type: 'list', choices: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], default: 'GET' });
    this._input({ name: 'language', type: 'list', choices: languages(), default: 'javascript' });
  }

  async create_api() {
    let answers = await this._prompt();

    const ignore = languageIgnorePattern(answers.language);
    answers.runtime = languageRuntime(answers.language);

    await this.fs.copyTplAsync(
      this.templatePath('**/*.*'),
      this.destinationRoot(),
      answers,
      {},
      { globOptions: { dot: true, ignore } },
    )
  }
}

module.exports = ApiGenerator;
