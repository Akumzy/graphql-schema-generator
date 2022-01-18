"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extractUniques = (model) => {
    return model.fields.filter(({ isUnique }) => isUnique);
};
exports.default = extractUniques;
//# sourceMappingURL=extractUniques.js.map