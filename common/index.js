const fs = require('fs');
const path = require('path');
const Generator = require('yeoman-generator');

const pascalCase = s => /[A-Z][A-Za-z0-9]*/.test(s) || "Value must be PascalCase";
const camelCase = s => /[a-z][A-Za-z0-9]*/.test(s) || "Value must be camelCase";
const kebabCase = s => /[a-z][a-z0-9-]*/.test(s) || "Value must be kebab-case";
const snakeCase = s => /[a-z][a-z0-9_]*/.test(s) || "Value must be snake_case";
const required = s => /.+/.test(s) || "Value is required";
const sourceName = s => /([a-z]+)(\.[a-z]+)+/.test(s) || "Must be an app name com.mycompany.mpapp";

const toKebabCase = s => s.match(/[A-Z][a-z0-9]*/g).map(s => s.toLowerCase()).join('-');

const _languages = {
	// "python": {
	// 	extension: "py",
	// 	runtime: "python3.9",
	// },
	// "typescript": {
	// 	extension: "ts",
	// 	runtime: "nodejs14.x",
	// },
	"javascript": {
		extension: "js",
		runtime: "nodejs14.x",
	},
};

const languages = () => Object.keys(_languages);

const languageRuntime = language => _languages[language].runtime;

const languageIgnorePattern = language => Object
	.entries(_languages)
	.filter(([lang, _]) => lang !== language)
	.map(([_, opt]) => `**/*.${opt.extension}.ejs`);

const vpcs = root => [
	'',
	...fs.readdirSync(path.join(root, 'terraform'))
	     .map(f => f.match(new RegExp(`^vpc__([^_]+)\.tf$`)))
	     .filter(exp => exp)
	     .map(exp => exp[1])
	];

const eventBuses = root => () => [
	...fs.readdirSync(path.join(root, 'terraform'))
			.map(f => f.match(new RegExp(`^eventbus__([^_]+)\.tf$`)))
			.filter(exp => exp)
			.map(exp => exp[1])
];

const apis = root => () => [
	...fs.readdirSync(path.join(root, 'terraform'))
	     .map(f => f.match(new RegExp(`^api__([^_]+)\.tf$`)))
	     .filter(exp => exp)
	     .map(exp => exp[1])
];

const apiResources = root => ({ api }) => [
	'',
	...fs.readdirSync(path.join(root, 'terraform'))
	     .map(f => f.match(new RegExp(`^api__${api}__([^_]+)\.tf$`)))
	     .filter(exp => exp)
	     .map(exp => exp[1])
];

class BaseGenerator extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this._inputs = { };
	}

	_input({ name, dataType = String, ...prompt }) {
    this.argument(name, { type: dataType, required: false });
    this._inputs[name] = prompt;
  }

	async _prompt() {
		let prompts = Object.entries(this._inputs)
			.map(([name, prompt]) => [name, prompt, this.options[name]])
      .filter(([name, { type, choices, validate }, value]) =>
        typeof value === 'undefined' ||
        validate && validate(value) !== true ||
        type === 'list' && !choices.includes(value)
      )
      .map(([name, prompt]) => ({ name, ...prompt }));

    let answers = await this.prompt(prompts);

    return {
      ...this.options,
      answers
    };
	}
}

module.exports = {
	BaseGenerator,
	vpcs,
	eventBuses,
	required,
	sourceName,
	apis,
	apiResources,
	pascalCase,
	camelCase,
	kebabCase,
	snakeCase,
	toKebabCase,
	languages,
	languageRuntime,
	languageIgnorePattern,
}
