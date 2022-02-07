const Generator = require('yeoman-generator');
const { processDestinationPath, pascalCase, eventBuses, required, languages, languageRuntime, languageIgnorePattern, vpcs } = require('../../common');

class ApiGenerator extends Generator {

  async execute() {
    this.answers = await this.prompt([
      {
        name: 'eventbus',
        message: 'Event Bus',
        type: 'list',
        choices: eventBuses(this.destinationRoot()),
      }, {
        name: 'name',
        message: 'Rule',
        type: 'input',
        validate: pascalCase,
      }, {
        name: 'description',
        message: 'description',
        type: 'input',
        validate: required,
      }, {
        name: 'source',
        message: 'Event Source',
        type: 'input',
        validate: required,
        store: true,
      }, {
        name: 'detailType',
        message: 'Detail Type',
        type: 'input',
        validate: required,
      }, {
        name: 'target',
        message: 'Target',
        type: 'list',
        choices: [ 'lambda' ],
      }, {
        name: 'vpc',
        type: 'list',
        choices: vpcs(this.destinationRoot()),
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
    );
  }
}

module.exports = ApiGenerator;
