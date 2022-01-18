"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const types_1 = require("./converters/types");
const addTypeModifiers_1 = (0, tslib_1.__importDefault)(require("./converters/addTypeModifiers"));
const convertType_1 = (0, tslib_1.__importDefault)(require("./converters/convertType"));
const extractScalars_1 = (0, tslib_1.__importDefault)(require("./extractors/extractScalars"));
const formatDefinition_1 = (0, tslib_1.__importDefault)(require("./formatters/formatDefinition"));
const formatField_1 = (0, tslib_1.__importDefault)(require("./formatters/formatField"));
const formatScalar_1 = (0, tslib_1.__importDefault)(require("./formatters/formatScalar"));
const utils_1 = require("./utils");
const getTypeConvertedFields = (model, config, isModelsOfSchema = false) => {
    if (!model) {
        return [];
    }
    const shouldIgnore = model.fields.reduce((acc, cur) => {
        const { relationFromFields } = cur;
        if (relationFromFields) {
            relationFromFields.forEach((field) => {
                acc[field] = true;
            });
        }
        return acc;
    }, {});
    const typeConvertedFields = model.fields.reduce((collected, field) => {
        var _a, _b;
        const { name } = field;
        if (shouldIgnore[name]) {
            return collected;
        }
        const applyCustomRulesBeforeTypeModifiersAddition = (f, m) => {
            return (0, convertType_1.default)(f, m, config, isModelsOfSchema);
        };
        const applyCustomRulesAfterTypeModifiersAddition = (f, m) => {
            return (0, addTypeModifiers_1.default)(f, m, config, isModelsOfSchema);
        };
        const transformers = [
            convertType_1.default,
            ((_a = config === null || config === void 0 ? void 0 : config.customRules) === null || _a === void 0 ? void 0 : _a.beforeAddingTypeModifiers) &&
                applyCustomRulesBeforeTypeModifiersAddition,
            addTypeModifiers_1.default,
            ((_b = config === null || config === void 0 ? void 0 : config.customRules) === null || _b === void 0 ? void 0 : _b.afterAddingTypeModifiers) &&
                applyCustomRulesAfterTypeModifiersAddition,
        ].filter(Boolean);
        try {
            const typeConvertedField = transformers.reduce((acc, transformer) => {
                return transformer(acc, model, config, isModelsOfSchema);
            }, field);
            return [...collected, typeConvertedField];
        }
        catch (err) {
            return collected;
        }
    }, []);
    return typeConvertedFields;
};
const transpile = (dataModel, config) => {
    var _a;
    const { models, enums, names } = dataModel;
    const queryFields = dataModel.names.reduce((acc, name) => {
        var _a;
        const modelFields = getTypeConvertedFields(models[name], config);
        const { name: idName } = (_a = modelFields.find(({ type }) => {
            if (typeof type !== 'string') {
                return false;
            }
            return type.match(types_1.SDL.ID);
        })) !== null && _a !== void 0 ? _a : { name: 'id' };
        return [
            ...acc,
            `${name.toLowerCase()}(${idName}: ID!): ${name}`,
            `${name.toLowerCase()}s: [${name}!]!`,
        ];
    }, []);
    const queriesOfSchema = (0, formatDefinition_1.default)({
        type: types_1.Definition.type,
        name: types_1.ReservedName.Query,
        fields: queryFields,
    });
    const mutationFields = dataModel.names.reduce((acc, name) => {
        var _a;
        const modelFields = getTypeConvertedFields(models[name], config);
        const { name: idName } = (_a = modelFields.find(({ type }) => {
            if (typeof type !== 'string') {
                return false;
            }
            return type.match(types_1.SDL.ID);
        })) !== null && _a !== void 0 ? _a : { name: 'id' };
        return [
            ...acc,
            `create${name}(${name.toLowerCase()}: ${name}CreateInput!): ${name}`,
            `update${name}(${name.toLowerCase()}: ${name}UpdateInput!): ${name}`,
            `delete${name}(${idName}: ID!): ${name}`,
        ];
    }, []);
    const mutationInputs = dataModel.names.reduce((inputs, modelName) => {
        const modelFields = getTypeConvertedFields(models[modelName], config);
        const fieldsWithoutID = modelFields.reduce((fields, cur) => {
            const { type } = cur;
            if (typeof type === 'string' && type.match(types_1.SDL.ID)) {
                return fields;
            }
            return [...fields, cur];
        }, []);
        const createInputFields = fieldsWithoutID.map(({ name, type }) => `${name}: ${type}`);
        const updateInputFields = fieldsWithoutID.map(({ name, type }) => `${name}: ${(0, utils_1.removeExclamation)(type)}`);
        return [
            ...inputs,
            (0, formatDefinition_1.default)({
                type: types_1.Definition.input,
                name: `${modelName}CreateInput`,
                fields: createInputFields,
            }) +
                (0, formatDefinition_1.default)({
                    type: types_1.Definition.input,
                    name: `${modelName}UpdateInput`,
                    fields: updateInputFields,
                }),
        ];
    }, []);
    const mutation = (0, formatDefinition_1.default)({
        type: types_1.Definition.type,
        name: types_1.ReservedName.Mutation,
        fields: mutationFields,
    });
    const mutationsOfSchema = mutationInputs + mutation;
    let whereInputs = [];
    if ((_a = config === null || config === void 0 ? void 0 : config.argConfig) === null || _a === void 0 ? void 0 : _a.models) {
        whereInputs = dataModel.names.reduce((inputs, modelName) => {
            var _a, _b;
            if (!((_b = (_a = config.argConfig) === null || _a === void 0 ? void 0 : _a.models) === null || _b === void 0 ? void 0 : _b.includes(modelName))) {
                return inputs;
            }
            const SUPPORTED_TYPES = [
                'Int',
                'Float',
                'String',
                'BigInt',
                'Boolean',
                'Decimal',
                'DateTime',
                'ID',
            ];
            const modelFields = getTypeConvertedFields(models[modelName], config);
            const supportedFields = modelFields.reduce((fields, cur) => {
                const { type } = cur;
                if (!SUPPORTED_TYPES.includes((0, utils_1.removeExclamation)(type))) {
                    return fields;
                }
                return [...fields, cur];
            }, []);
            const filters = {
                ID: 'StringFilter',
                Int: 'IntFilter',
                Float: 'IntFilter',
                String: 'StringFilter',
                Boolean: 'BooleanFilter',
                Decimal: 'IntFilter',
                DateTime: 'DateTimeFilter',
            };
            const inputFields = supportedFields.map(({ name, type }) => `${name}: ${filters[(0, utils_1.removeExclamation)(type)]}`);
            return [
                ...inputs,
                (0, formatDefinition_1.default)({
                    type: types_1.Definition.input,
                    name: `${modelName}WhereInput`,
                    fields: inputFields,
                }),
            ];
        }, []);
    }
    const scalars = (0, extractScalars_1.default)(dataModel);
    const scalarsOfSchema = scalars
        .map((scalar) => (0, formatScalar_1.default)(scalar))
        .join('');
    const enumsOfSchema = Object.entries(enums)
        .map(([name, anEnum]) => {
        const fields = anEnum.map(({ name: field }) => `\t${field}`);
        return (0, formatDefinition_1.default)({
            type: types_1.Definition.enum,
            name,
            fields,
        });
    })
        .join('');
    const modelsOfSchema = names
        .map((name) => {
        const fields = getTypeConvertedFields(models[name], config, true).map((field) => (0, formatField_1.default)(field));
        return (0, formatDefinition_1.default)({
            type: types_1.Definition.type,
            name,
            fields,
        });
    })
        .join('');
    const schema = whereInputs +
        ((config === null || config === void 0 ? void 0 : config.createQuery) === 'true' ? queriesOfSchema : '') +
        ((config === null || config === void 0 ? void 0 : config.createMutation) === 'true' ? mutationsOfSchema : '') +
        scalarsOfSchema +
        enumsOfSchema +
        modelsOfSchema;
    return (0, utils_1.sdl)(schema, !!(config === null || config === void 0 ? void 0 : config.ignoreWhereFilters));
};
exports.default = transpile;
//# sourceMappingURL=transpile.js.map