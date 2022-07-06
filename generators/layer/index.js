const { BaseGenerator, processDestinationPath, languages, languageRuntime, kebabCase } = require('../../common');

class LayerGenerator extends BaseGenerator {

  constructor(args, opts) {
    super(args, opts);

    this._input({ name: 'name', type: 'input', validate: kebabCase });
    this._input({ name: 'language', type: 'list', choices: languages(), default: 'javascript', store: true });
    this._input({ name: 'author', type: 'input', store: true });
    this._input({ name: 'email', type: 'input', store: true });
  }

  async execute() {
    let answers = await this._prompt();
    answers['runtime'] = languageRuntime(answers['language']);

    await this.fs.copyTplAsync(
      this.templatePath('all/**/*.ejs'),
      this.destinationRoot(),
      answers,
      {},
      {
        globOptions: { dot: true },
      }
    );
    await this.fs.copyTplAsync(
      this.templatePath(`${answers['language']}/**/*`),
      this.destinationRoot(),
      answers,
      {},
      {
        globOptions: { dot: true },
      }
    );
  }
}

module.exports = LayerGenerator;
