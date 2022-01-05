const fs = require('fs');
const path = require('path');

const pascalCase = s => /[A-Z][A-Za-z0-9]*/.test(s) || "Value must be PascalCase";
const camelCase = s => /[a-z][A-Za-z0-9]*/.test(s) || "Value must be camelCase";
const kebabCase = s => /[a-z][a-z0-9-]*/.test(s) || "Value must be kebab-case";
const snakeCase = s => /[a-z][a-z0-9_]*/.test(s) || "Value must be snake_case";

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

const languageIgnorePattern = language => Object
	.entries(_languages)
	.filter(([lang, _]) => lang !== language)
	.map(([_, opt]) => `**/*.${opt.extension}.ejs`);

const vpcs = root => [
	'',
	...fs.readdirSync(path.join(root, 'terraform'))
	     .map(f => f.match(new RegExp(`^api_([^_]+)\.tf$`)))
	     .filter(exp => exp)
	     .map(exp => exp[1])
	];
const apis = root => () => [
	...fs.readdirSync(path.join(root, 'terraform'))
	     .map(f => f.match(new RegExp(`^api_([^_]+)\.tf$`)))
	     .filter(exp => exp)
	     .map(exp => exp[1])
];
const apiResources = root => ({ api }) => [
	'',
	...fs.readdirSync(path.join(root, 'terraform'))
	     .map(f => f.match(new RegExp(`^api_${api}_([^_]+)\.tf$`)))
	     .filter(exp => exp)
	     .map(exp => exp[1])
];

module.exports = {
	vpcs,
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
