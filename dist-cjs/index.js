#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = (0, tslib_1.__importStar)(require("fs"));
const path = (0, tslib_1.__importStar)(require("path"));
const generator_helper_1 = require("@prisma/generator-helper");
const generateGraphqlSchema_1 = (0, tslib_1.__importDefault)(require("./generateGraphqlSchema"));
(0, tslib_1.__exportStar)(require("./converters/types"), exports);
(0, generator_helper_1.generatorHandler)({
    onManifest() {
        return {
            defaultOutput: './generated',
            prettyName: 'GraphQL-Schema-Generator',
        };
    },
    async onGenerate(options) {
        var _a;
        const output = (_a = options.generator.output) === null || _a === void 0 ? void 0 : _a.value;
        const { config } = options.generator;
        if (output) {
            if (config === null || config === void 0 ? void 0 : config.customRules) {
                const module = await Promise.resolve().then(() => (0, tslib_1.__importStar)(require(path.join(output, '..', config === null || config === void 0 ? void 0 : config.customRules))));
                config.customRules = module.default.rules;
                config.argConfig = module.default.argConfig;
            }
            const result = await (0, generateGraphqlSchema_1.default)(options.datamodel, config);
            try {
                await fs.promises.mkdir(output, {
                    recursive: true,
                });
                await fs.promises.writeFile(path.join(output, 'schema.graphql'), result);
            }
            catch (e) {
                console.error('Error: unable to write files for GraphQL-Schema-Generator');
                throw e;
            }
        }
        else {
            throw new Error('No output was specified for GraphQL-Schema-Generator');
        }
    },
});
//# sourceMappingURL=index.js.map