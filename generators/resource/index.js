const Generator = require('yeoman-generator');
const { pascalCase, apis, apiResources, toKebabCase } = require("../../common");

class ApiGenerator extends Generator {

  async create_api_resource() {
    this.answers = await this.prompt([
      {
        name: 'api',
        type: 'list',
        choices: apis(this.destinationRoot()),
      }, {
        name: 'parent',
        type: 'list',
        choices: apiResources(this.destinationRoot()),
      }, {
        name: 'resource',
        type: 'input',
        validate: pascalCase,
      }, {
        name: 'pathpart',
        type: 'input',
        default: ({ resource }) => toKebabCase(resource)
      }
    ]);

    await this.fs.copyTplAsync(
      this.templatePath('**/*.ejs'),
      this.destinationRoot(),
      this.answers,
      {},
      { globOptions: { dot: true } },
    )
  }
}

module.exports = ApiGenerator;

