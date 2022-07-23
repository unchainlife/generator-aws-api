const fs = require('fs');
const path = require('path');
const Generator = require('yeoman-generator');

const NONE = "(none)"
const isNone = v => v === NONE;
const isNotNone = v => !isNone(v);
const safeNone = (v, safeValue = '') => isNone(v) ? safeValue : v; 

const or = (a, b) => s => {
	const ra = a(s);
	if (ra === true) return true;
	return b(s);
}
const nullable = s => s == '' || "Value must be empty";
const required = s => /.+/.test(s) || "Value is required";
const shortCode = s => /^[a-z]{1,6}$/.test(s) || "Value must be 1-6 lowercase characters";
const pascalCase = s => /^[A-Z][A-Za-z0-9]*$/.test(s) || "Value must be PascalCase";
const camelCase = s => /^[a-z][A-Za-z0-9]*$/.test(s) || "Value must be camelCase";
const kebabCase = s => /^[a-z][a-z0-9-]*$/.test(s) || "Value must be kebab-case";
const snakeCase = s => /^[a-z][a-z0-9_]*$/.test(s) || "Value must be snake_case";
const domainName = s => /^([a-z]+)(\.[a-z]+)+$/.test(s) || "Must be an app name com.mycompany.mpapp";

const toKebabCase = s => s.match(/[A-Z][a-z0-9]*/g).map(s => s.toLowerCase()).join('-');

const _languages = {
	"python": {
		extension: "py",
		runtime: "python3.9",
	},
	"typescript": {
		extension: "ts",
		runtime: "nodejs14.x",
	},
	"javascript": {
		extension: "js",
		runtime: "nodejs14.x",
	},
};

const languages = () => Object.keys(_languages);

const languageRuntime = language => _languages[language].runtime;
const languageExtension = language => _languages[language].extension;

const languageIgnorePattern = language => Object
	.entries(_languages)
	.filter(([lang, _]) => lang !== language)
	.map(([_, opt]) => `**/*.${opt.extension}.ejs`);

const list = ({ root, pattern, strict, index = 1 }) => {
	return [
		...(strict ? [] : [ NONE ]),
		...fs.readdirSync(path.join(root, 'terraform'))
			.map(f => f.match(new RegExp(pattern)))
			.filter(exp => exp)
			.map(exp => exp[index])
	]
};

const apis = root => () => list({ root, pattern: `^api__([^_\.]+)\.tf$`, strict: true });
const apiResources = root => ({ api }) => list({ root, pattern: `^api__${api}__([^_\.]+)\.tf$`, strict: false });
const vpcs = (root, strict) => () => list({ root, pattern: '^vpc__([^_\.]+)\.tf$', strict });
const subnets = (root) => ({ vpc }) => list({ root, pattern: `^vpc__${vpc}__([^_\.]+)\.tf$` });
const eventBuses = root => () => list({ root, pattern: `^eventbus__([^_\.]+)\.tf$` });
const zones = root => () => list({ root, pattern: `^dns__([^_\.]+)\.tf$` });
const layers = root => () => list({ root, pattern: `^layer__([^_\.]+)\.tf$`, strict: true });
const kmsKeys = (root, strict) => () => list({ root, pattern: `^kms__([^_\.]+)\.tf$`, strict });

const resolve = (v, ...args) => typeof(v) === 'function' ? v(...args) : v;

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
		const split_checkbox_into_array = ({ type }, v) => v && (type === 'checkbox'? v.split(',') : v);
		const cli_arguments = Object.entries(this._inputs)
			.map(([k, v]) => [k, split_checkbox_into_array(v, this.options[k])])
			.reduce((s, [k, v]) => ({ ...s, [k]: v }), {});
		const prompts_for_missing_cli_args = Object.entries(this._inputs)
			.map(([name, prompt]) => [name, prompt, cli_arguments[name]])
			.filter(([name, { type, choices, validate }, value]) =>
				typeof value === 'undefined' ||
				validate && validate(value) !== true ||
				type === 'list' && !resolve(choices, this.options).includes(value)
			)
			.map(([name, { store, default: d, ...prompt }]) => ({ name, default: store ? this.config.get(name) || d : d, ...prompt }));

		let answers = await this.prompt(prompts_for_missing_cli_args) || {};

		const results = {
			...cli_arguments,
			...answers
		};

		const inputs_to_store = Object.entries(this._inputs).filter(([name, { store }]) => !!resolve(store, results)).map(([name]) => name);
		for (const name of inputs_to_store) {
			this.config.set(name, results[name]);
		}
		this.config.save();
		return results;
	}
}

module.exports = {
	NONE,
	isNone,
	isNotNone,
	safeNone,
	BaseGenerator,
	vpcs,
	subnets,
	eventBuses,
	required,
	domainName,
	apis,
	zones,
	apiResources,
	layers,
	kmsKeys,
	or,
	shortCode,
	nullable,
	pascalCase,
	camelCase,
	kebabCase,
	snakeCase,
	toKebabCase,
	languages,
	languageRuntime,
	languageIgnorePattern,
}
