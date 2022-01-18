import existingRules from './rules/scalar';
const convertScalar = (initialField, model, config, isModelsOfSchema = false) => {
    var _a;
    const rules = [
        ...existingRules,
        ...(((_a = config === null || config === void 0 ? void 0 : config.customRules) === null || _a === void 0 ? void 0 : _a.beforeAddingTypeModifiers) || []),
    ];
    const newField = rules.reduce((field, { matcher, transformer }) => {
        if (matcher(field, model, isModelsOfSchema, config)) {
            return transformer(field);
        }
        return field;
    }, initialField);
    return newField;
};
export default convertScalar;
//# sourceMappingURL=convertScalar.js.map