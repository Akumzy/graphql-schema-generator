"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const scalar_1 = (0, tslib_1.__importDefault)(require("./rules/scalar"));
const convertScalar = (initialField, model, config, isModelsOfSchema = false) => {
    var _a;
    const rules = [
        ...scalar_1.default,
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
exports.default = convertScalar;
//# sourceMappingURL=convertScalar.js.map