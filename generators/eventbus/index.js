const Generator = require('yeoman-generator');
const { processDestinationPath, pascalCase, toKebabCase, kebabCase } = require('../../common');

class ApiGenerator extends Generator {

  async execute() {
    this.answers = await this.prompt([
      {
        name: 'name',
        type: 'input',
        validate: pascalCase,
      }
    ]);

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
