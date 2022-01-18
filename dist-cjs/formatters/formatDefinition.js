"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatModel = ({ type, name, fields, }) => `${type} ${name} {\n${fields.join('\n')}\n}\n`;
exports.default = formatModel;
//# sourceMappingURL=formatDefinition.js.map