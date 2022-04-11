const { BaseGenerator, pascalCase, apis, apiResources, toKebabCase } = require("../../common");

class ApiGenerator extends BaseGenerator {

  constructor(args, opts) {
    super(args, opts);

    this._input({ name: "api", type: "list", choices: apis(this.destinationRoot()) });
    this._input({ name: "parent", type: "list", choices: apiResources(this.destinationRoot()) });
    this._input({ name: "resource", type: "input", validate: pascalCase });
    this._input({ name: "pathpart", type: "input", default: ({ resource }) => toKebabCase(resource)})
  }

  async create_api_resource() {
    let answers = await this._prompt();

    await this.fs.copyTplAsync(
      this.templatePath('**/*.ejs'),
      this.destinationRoot(),
      answers,
      {},
      { globOptions: { dot: true } },
    )
  }
}

module.exports = ApiGenerator;
