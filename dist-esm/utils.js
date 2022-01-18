import { printSchema, buildSchema } from 'graphql';
import whereFilterTypedefs from './where-filters-typedef';
export const sdl = (s, ignoreWhereFilters = false) => printSchema(buildSchema(ignoreWhereFilters ? s : whereFilterTypedefs + s));
export const removeExclamation = (s) => {
    if (s.match(/!$/)) {
        return s.slice(0, -1);
    }
    return s;
};
export const removeBracketsOrExclamations = (s) => {
    return s.replace(/!|\[|\]/g, '');
};
//# sourceMappingURL=utils.js.map