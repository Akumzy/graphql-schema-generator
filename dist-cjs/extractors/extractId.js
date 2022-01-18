"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extractId = (model) => {
    const { fields } = model;
    return fields.find(({ isId }) => isId);
};
exports.default = extractId;
//# sourceMappingURL=extractId.js.map