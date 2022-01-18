"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeBracketsOrExclamations = exports.removeExclamation = exports.sdl = void 0;
const tslib_1 = require("tslib");
const graphql_1 = require("graphql");
const where_filters_typedef_1 = (0, tslib_1.__importDefault)(require("./where-filters-typedef"));
const sdl = (s, ignoreWhereFilters = false) => (0, graphql_1.printSchema)((0, graphql_1.buildSchema)(ignoreWhereFilters ? s : where_filters_typedef_1.default + s));
exports.sdl = sdl;
const removeExclamation = (s) => {
    if (s.match(/!$/)) {
        return s.slice(0, -1);
    }
    return s;
};
exports.removeExclamation = removeExclamation;
const removeBracketsOrExclamations = (s) => {
    return s.replace(/!|\[|\]/g, '');
};
exports.removeBracketsOrExclamations = removeBracketsOrExclamations;
//# sourceMappingURL=utils.js.map