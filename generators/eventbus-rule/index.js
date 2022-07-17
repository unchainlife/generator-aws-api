const { BaseGenerator, processDestinationPath, eventBuses, required, languages, languageRuntime, languageIgnorePattern, vpcs } = require('../../common');

class EventBusRuleGenerator extends BaseGenerator {

  constructor(args, opts) {
    super(args, opts);


    this._input({
      name: 'eventbus',
      message: 'Event Bus',
      type: 'list',
      choices: eventBuses(this.destinationRoot()),
    })
    this._input({
      name: 'name',
      message: 'Rule',
      type: 'input',
      validate: kebabCase,
    });
    this._input({
      name: 'description',
      message: 'description',
      type: 'input',
      validate: required,
    });
    this._input({
      name: 'source',
      message: 'Event Source',
      default: 'com.mycompany.myapp',
      type: 'input',
      validate: souceName,
      store: true,
    });
    this._input({
      name: 'detailType',
      message: 'Detail Type',
      type: 'input',
      validate: required,
    });
    this._input({
      name: 'target',
      message: 'Target',
      type: 'list',
      choices: [ 'lambda' ],
    });
    this._input({
      name: 'vpc',
      type: 'list',
      choices: vpcs(this.destinationRoot()),
    });
    this._input({
      name: 'language',
      type: 'list',
      choices: languages(),
      default: 'javascript',
      store: true
    });
  }

  async execute() {
    let answers = await this._prompt();

    const ignore = languageIgnorePattern(this.answers.language);
    this.answers.runtime = languageRuntime(this.answers.language);

    await this.fs.copyTplAsync(
      this.templatePath('**/*.*'),
      this.destinationRoot(),
      answers,
      {},
      { globOptions: { dot: true, ignore } },
    );
  }
}

module.exports = EventBusRuleGenerator;
