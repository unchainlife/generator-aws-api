const Generator = require('yeoman-generator');

class ApiGenerator extends Generator {

  async create_api() {
    this.answers = await this.prompt();

    await this.copyTplAsync(
      this.templatePath('**/*.ejs'),
      this.destinationRoot(),
      this.answers,
      {},
      { globOptions: { dot: true } },
    )
  }
}

module.exports = ApiGenerator;

