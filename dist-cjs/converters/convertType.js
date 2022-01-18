"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const convertScalar_1 = (0, tslib_1.__importDefault)(require("./convertScalar"));
const convertType = (field, model, config, isModelsOfSchema = false) => {
    const { kind } = field;
    if (kind === 'scalar' || (config === null || config === void 0 ? void 0 : config.customRules)) {
        return (0, convertScalar_1.default)(field, model, config, isModelsOfSchema);
    }
    // TODO
    return field;
};
exports.default = convertType;
//# sourceMappingURL=convertType.js.map