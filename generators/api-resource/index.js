const { BaseGenerator, kebabCase, apis, apiResources, toKebabCase } = require("../../common");

class ApiResourceGenerator extends BaseGenerator {

  constructor(args, opts) {
    super(args, opts);

    this._input({ name: "api", type: "list", choices: apis(this.destinationRoot()) });
    this._input({ name: "parent", type: "list", choices: apiResources(this.destinationRoot()) });
    this._input({ name: "resource", type: "input", validate: kebabCase });
    this._input({ name: "pathpart", type: "input", default: ({ resource }) => resource})
  }

  async create_api_resource() {
    let answers = await this._prompt();
    answers.fullname = [answers.parent, answers.resource].filter(s => s).join('-');

    await this.fs.copyTplAsync(
      this.templatePath('**/*.ejs'),
      this.destinationRoot(),
      answers,
      {},
      { globOptions: { dot: true } },
    )
  }
}

module.exports = ApiResourceGenerator;
