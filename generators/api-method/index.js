const Generator = require('yeoman-generator');
const { pascalCase, vpcs, apis, apiResources, languages, languageRuntime, languageIgnorePattern } = require("../../common");

class ApiGenerator extends Generator {

  async create_api() {
    this.answers = await this.prompt([
      {
        name: 'vpc',
        type: 'list',
        choices: vpcs(this.destinationRoot()),
      }, {
        name: 'api',
        type: 'list',
        choices: apis(this.destinationRoot()),
      }, {
        name: 'resource',
        type: 'list',
        choices: apiResources(this.destinationRoot()),
      }, {
        name: 'method',
        type: 'list',
        choices: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        default: 'GET',
      }, {
        name: 'language',
        type: 'list',
        choices: languages(),
        default: 'javascript',
      }
    ]);
    const ignore = languageIgnorePattern(this.answers.language);
    this.answers.runtime = languageRuntime(this.answers.language);

    await this.fs.copyTplAsync(
      this.templatePath('**/*.*'),
      this.destinationRoot(),
      this.answers,
      {},
      { globOptions: { dot: true, ignore } },
    )
  }
}

module.exports = ApiGenerator;
