import { removeBracketsOrExclamations } from '../../utils';
const addBrasket = (field) => {
    const { type } = field;
    return { ...field, type: `[${type}]` };
};
const addExclamation = (field) => {
    const { type } = field;
    return { ...field, type: `${type}!` };
};
const rules = [
    {
        matcher: (field) => {
            const { isList, isRequired } = field;
            if (isList) {
                console.assert(isRequired);
            }
            return isList;
        },
        transformer: (field) => {
            return [addExclamation, addBrasket, addExclamation].reduce((acc, cur) => cur(acc), field);
        },
    },
    {
        matcher: (field) => {
            const { isList, isRequired } = field;
            return !isList && isRequired;
        },
        transformer: (field) => addExclamation(field),
    },
    {
        matcher: (field, _model, isModelsOfSchema, config) => {
            var _a;
            console.log({ isModelsOfSchema, config });
            if (typeof isModelsOfSchema === 'boolean' && isModelsOfSchema) {
                return !!((_a = config === null || config === void 0 ? void 0 : config.argConfig) === null || _a === void 0 ? void 0 : _a.fields.includes(field.name));
            }
            return false;
        },
        transformer: (field) => {
            return {
                ...field,
                name: `${field.name}(where:${removeBracketsOrExclamations(field.type)}WhereInput)`,
            };
        },
    },
];
export default rules;
//# sourceMappingURL=modifier.js.map