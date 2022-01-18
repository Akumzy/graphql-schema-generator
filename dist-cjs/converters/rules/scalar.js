"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const types_1 = require("../types");
const extractId_1 = (0, tslib_1.__importDefault)(require("../../extractors/extractId"));
const extractUniques_1 = (0, tslib_1.__importDefault)(require("../../extractors/extractUniques"));
const rules = [
    {
        matcher: (field) => {
            const { type } = field;
            if (type === types_1.PSL.Json) {
                return true;
            }
            return false;
        },
        transformer: (field) => ({ ...field, type: types_1.SDL.String }),
    },
    {
        matcher: (field) => {
            const { type } = field;
            if (type === types_1.PSL.BigInt) {
                return true;
            }
            return false;
        },
        transformer: (field) => ({ ...field, type: types_1.SDL.Int }),
    },
    {
        matcher: (field) => {
            const { type } = field;
            if (type === types_1.PSL.Decimal) {
                return true;
            }
            return false;
        },
        transformer: (field) => ({ ...field, type: types_1.SDL.Float }),
    },
    {
        matcher: (field) => {
            const { type } = field;
            if (type === types_1.PSL.Bytes) {
                return true;
            }
            return false;
        },
        transformer: (field) => ({ ...field, type: types_1.Scalar.ByteArray }),
    },
    {
        matcher: (field) => {
            const { isId } = field;
            return isId;
        },
        transformer: (field) => ({ ...field, type: types_1.SDL.ID }),
    },
    {
        matcher: (field, model) => {
            const { isUnique } = field;
            const idField = (0, extractId_1.default)(model);
            const uniqueFields = (0, extractUniques_1.default)(model);
            return !idField && uniqueFields.length === 1 && isUnique;
        },
        transformer: (field) => ({ ...field, type: types_1.SDL.ID }),
    },
];
exports.default = rules;
//# sourceMappingURL=scalar.js.map