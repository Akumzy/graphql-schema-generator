"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Definition = exports.ReservedName = exports.Scalar = exports.PSL = exports.SDL = void 0;
var SDL;
(function (SDL) {
    SDL["ID"] = "ID";
    SDL["Int"] = "Int";
    SDL["Float"] = "Float";
    SDL["String"] = "String";
    SDL["Boolean"] = "Boolean";
})(SDL || (SDL = {}));
exports.SDL = SDL;
var PSL;
(function (PSL) {
    PSL["Int"] = "Int";
    PSL["Float"] = "Float";
    PSL["String"] = "String";
    PSL["BigInt"] = "BigInt";
    PSL["Boolean"] = "Boolean";
    PSL["Decimal"] = "Decimal";
    PSL["DateTime"] = "DateTime";
    PSL["Json"] = "Json";
    PSL["Bytes"] = "Bytes";
    PSL["Unsupported"] = "Unsupported";
})(PSL || (PSL = {}));
exports.PSL = PSL;
var Scalar;
(function (Scalar) {
    Scalar["ByteArray"] = "ByteArray";
    Scalar["DateTime"] = "DateTime";
})(Scalar || (Scalar = {}));
exports.Scalar = Scalar;
var ReservedName;
(function (ReservedName) {
    ReservedName["Query"] = "Query";
    ReservedName["Mutation"] = "Mutation";
})(ReservedName || (ReservedName = {}));
exports.ReservedName = ReservedName;
var Definition;
(function (Definition) {
    Definition["type"] = "type";
    Definition["enum"] = "enum";
    Definition["input"] = "input";
})(Definition || (Definition = {}));
exports.Definition = Definition;
//# sourceMappingURL=types.js.map