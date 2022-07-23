const path = require('path');
const { BaseGenerator, kebabCase, listVpcs, listApis, listApiResources, languages, languageRuntime, listLayers } = require("../../common");

class ApiMethodGenerator extends BaseGenerator {

  constructor(args, opts) {
    super(args, opts);

    this._input({ name: 'vpc', type: 'list', choices: listVpcs(this.destinationRoot()) });
    this._input({ name: 'api', type: 'list', choices: listApis(this.destinationRoot()) });
    this._input({ name: 'resource', type: 'list', choices: listApiResources(this.destinationRoot()) });
    this._input({ name: 'method', type: 'list', choices: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], default: 'GET' });
    this._input({ name: 'language', type: 'list', choices: languages(), store: true });
    this._input({ name: 'layers', type: 'checkbox', choices: listLayers(this.destinationRoot()) });
  }

  async create_api() {
    let answers = await this._prompt();
    const data = {
      ...answers,
      runtime: languageRuntime(answers['language'])
    };

    await this.fs.copyTplAsync(
      this.templatePath('all/**/*.*'),
      this.destinationRoot(),
      data,
      {},
      { globOptions: { dot: true } },
    )
    await this.fs.copyTplAsync(
      this.templatePath(`${answers['language']}/**/*.*`),
      this.destinationRoot(),
      data,
      {},
      { globOptions: { dot: true } },
    )
  }
}

module.exports = ApiMethodGenerator;
