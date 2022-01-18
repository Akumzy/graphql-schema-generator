"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatField = (field) => {
    const { name, type } = field;
    return `\t${name}: ${type}`;
};
exports.default = formatField;
//# sourceMappingURL=formatField.js.map