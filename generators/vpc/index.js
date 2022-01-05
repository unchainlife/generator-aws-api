const Generator = require('yeoman-generator');
const { vpcs } = require("../../common");

class ApiGenerator extends Generator {

  async create_vpc() {
    this.answers = await this.prompt([
      {
        name: 'vpc',
        type: 'list',
        default: vpcs(),
      }
    ]);

    await this.fs.copyTplAsync(
      this.templatePath('**/*.*'),
      this.destinationRoot(),
      this.answers,
      {},
      { globOptions: { dot: true } },
    )
  }
}

module.exports = ApiGenerator;

