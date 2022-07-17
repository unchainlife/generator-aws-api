const fs = require("fs");
const yaml = require("js-yaml");
const { BaseGenerator, kebabCase, apis, apiResources, toKebabCase, languages, languageRuntime, vpcs, layers } = require("../../common");

const isYaml = filename => filename.endsWith('.yaml') || filename.endsWith('yml');

const validateFilename = filename => fs.existsSync(filename) || "File does not exist";

const apiEndPoints = filename => {
  const raw = fs.readFileSync(filename, 'utf-8');
  const json = isYaml(filename) ? yaml.load(raw) : JSON.parse(raw);
  return Object.entries(json.paths).map(([path, methods]) => Object.keys(methods).map(method => `${method} ${path}`)).flat();
}

const buildOperationId = (path, method) => `${path.replace('/', '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase().slice(1)}--${method.toUpperCase()}`;

class ApiSwaggerGenerator extends BaseGenerator {

  constructor(args, opts) {
    super(args, opts);

    this._input({
      name: "name",
      type: "input",
      validate: kebabCase
    });
    this._input({
      name: "filename",
      type: "input",
      validate: validateFilename,
      default: 'swagger.yaml'
    });
    this._input({ 
      name: 'endpoints',
      type: 'checkbox',
      choices: ({ filename }) => apiEndPoints(filename),
      default: ({ filename }) => apiEndPoints(filename),
    });
    this._input({
      name: 'language',
      type: 'list',
      choices: languages,
      store: true
    });
    this._input({ 
      name: 'vpc',
      type: 'list',
      choices: vpcs(this.destinationRoot())
    });
    this._input({
      name: 'layers',
      type: 'checkbox',
      choices: layers(this.destinationRoot()),
      default: layers(this.destinationRoot()),
    });
  }

  async create_api_resource() {
    let answers = await this._prompt();
    const { name, filename, language, vpc, layers } = answers;

    const normalise = o => {
      if (Array.isArray(o)) return o.map(x => normalise(x));
      if (typeof o !== "object") return o;
      return Object.entries(o)
                   .map(([k, v]) => [k.replace(/_/g, ""), v])
                   .reduce((s, [k, v]) => ({ ...s, [k]: normalise(v) }), {});
    }

    const raw = fs.readFileSync(filename, 'utf-8');
    const json = isYaml(filename) ? yaml.load(raw) : JSON.parse(raw);
    json.components = normalise(json.components);

    const endpoints = answers.endpoints
      .map(e => e.split(' '))
      .map(([method, path]) => [
        path,
        method,
        json.paths[path][method].operationId || buildOperationId(path, method)]
      );
    for (const [path, method, operationId] of endpoints) {
      json.paths[path][method]["x-amazon-apigateway-integration"] = {
        httpMethod: "POST",
        uri: `\${method_${operationId}}`,
        responses: {
          default: {
            statusCode: Object.keys(json.paths[path][method].responses)[0]
          }
        },
        passthroughBehavior: 'when_no_match',
        contentHandling: "CONVERT_TO_TEXT",
        type: "aws",
        // credentials: '${credentials_x}',
      };
    }

    const replacer = (key, value) => {
      if (key === "pattern") value = value.replace(/\\/g, "\\\\");
      if (key === "$ref") value = value.replace(/_/g, "");
      return value;
    }

    answers.raw = yaml.dump(json, {
      replacer
    });

    const operations = endpoints.map(([path, method, operationId]) => operationId);

    await this.fs.copyTplAsync(
      this.templatePath('all/**/*.ejs'),
      this.destinationRoot(),
      { ...answers, operations },
      {},
      { globOptions: { dot: true } },
    );
    for (const [path, method, operationId] of endpoints) {
      const data = { 
        api: name,
        path,
        method,
        operationId,
        language,
        runtime: languageRuntime(language),
        vpc,
        layers,
      };
      await this.fs.copyTplAsync(
        this.templatePath('each/**/*'),
        this.destinationRoot(),
        data,
        {},
        { globOptions: { dot: true } },
      );
      await this.fs.copyTplAsync(
        this.templatePath(`${language}/**/*`),
        this.destinationRoot(),
        data,
        {},
        { globOptions: { dot: true } },
      );
    }
  }
}

module.exports = ApiSwaggerGenerator;
