const { BaseGenerator, kebabCase, apis, apiResources, safeNone, isNone, isNotNone } = require("../../common");

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
    const { parent, resource } = answers;
    const data = {
      ...answers,
      isNone,
      fullname: [parent, resource].filter(isNotNone).join('-'),
      safe_name: safeNone(parent)
    };

    await this.fs.copyTplAsync(
      this.templatePath('**/*.ejs'),
      this.destinationRoot(),
      data,
      {},
      { globOptions: { dot: true } },
    )
  }
}

module.exports = ApiResourceGenerator;
