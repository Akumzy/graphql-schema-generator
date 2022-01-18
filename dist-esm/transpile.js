import { Definition, ReservedName, SDL } from './converters/types';
import addTypeModifiers from './converters/addTypeModifiers';
import convertType from './converters/convertType';
import extractScalars from './extractors/extractScalars';
import formatDefinition from './formatters/formatDefinition';
import formatField from './formatters/formatField';
import formatScalar from './formatters/formatScalar';
import { removeExclamation, sdl } from './utils';
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
            return convertType(f, m, config, isModelsOfSchema);
        };
        const applyCustomRulesAfterTypeModifiersAddition = (f, m) => {
            return addTypeModifiers(f, m, config, isModelsOfSchema);
        };
        const transformers = [
            convertType,
            ((_a = config === null || config === void 0 ? void 0 : config.customRules) === null || _a === void 0 ? void 0 : _a.beforeAddingTypeModifiers) &&
                applyCustomRulesBeforeTypeModifiersAddition,
            addTypeModifiers,
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
            return type.match(SDL.ID);
        })) !== null && _a !== void 0 ? _a : { name: 'id' };
        return [
            ...acc,
            `${name.toLowerCase()}(${idName}: ID!): ${name}`,
            `${name.toLowerCase()}s: [${name}!]!`,
        ];
    }, []);
    const queriesOfSchema = formatDefinition({
        type: Definition.type,
        name: ReservedName.Query,
        fields: queryFields,
    });
    const mutationFields = dataModel.names.reduce((acc, name) => {
        var _a;
        const modelFields = getTypeConvertedFields(models[name], config);
        const { name: idName } = (_a = modelFields.find(({ type }) => {
            if (typeof type !== 'string') {
                return false;
            }
            return type.match(SDL.ID);
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
            if (typeof type === 'string' && type.match(SDL.ID)) {
                return fields;
            }
            return [...fields, cur];
        }, []);
        const createInputFields = fieldsWithoutID.map(({ name, type }) => `${name}: ${type}`);
        const updateInputFields = fieldsWithoutID.map(({ name, type }) => `${name}: ${removeExclamation(type)}`);
        return [
            ...inputs,
            formatDefinition({
                type: Definition.input,
                name: `${modelName}CreateInput`,
                fields: createInputFields,
            }) +
                formatDefinition({
                    type: Definition.input,
                    name: `${modelName}UpdateInput`,
                    fields: updateInputFields,
                }),
        ];
    }, []);
    const mutation = formatDefinition({
        type: Definition.type,
        name: ReservedName.Mutation,
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
                if (!SUPPORTED_TYPES.includes(removeExclamation(type))) {
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
            const inputFields = supportedFields.map(({ name, type }) => `${name}: ${filters[removeExclamation(type)]}`);
            return [
                ...inputs,
                formatDefinition({
                    type: Definition.input,
                    name: `${modelName}WhereInput`,
                    fields: inputFields,
                }),
            ];
        }, []);
    }
    const scalars = extractScalars(dataModel);
    const scalarsOfSchema = scalars
        .map((scalar) => formatScalar(scalar))
        .join('');
    const enumsOfSchema = Object.entries(enums)
        .map(([name, anEnum]) => {
        const fields = anEnum.map(({ name: field }) => `\t${field}`);
        return formatDefinition({
            type: Definition.enum,
            name,
            fields,
        });
    })
        .join('');
    const modelsOfSchema = names
        .map((name) => {
        const fields = getTypeConvertedFields(models[name], config, true).map((field) => formatField(field));
        return formatDefinition({
            type: Definition.type,
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
    return sdl(schema, !!(config === null || config === void 0 ? void 0 : config.ignoreWhereFilters));
};
export default transpile;
//# sourceMappingURL=transpile.js.map