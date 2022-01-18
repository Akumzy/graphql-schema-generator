import { DMMF } from '@prisma/generator-helper';
import { Config } from '../generateGraphqlSchema';
declare enum SDL {
    ID = "ID",
    Int = "Int",
    Float = "Float",
    String = "String",
    Boolean = "Boolean"
}
declare enum PSL {
    Int = "Int",
    Float = "Float",
    String = "String",
    BigInt = "BigInt",
    Boolean = "Boolean",
    Decimal = "Decimal",
    DateTime = "DateTime",
    Json = "Json",
    Bytes = "Bytes",
    Unsupported = "Unsupported"
}
declare enum Scalar {
    ByteArray = "ByteArray",
    DateTime = "DateTime"
}
declare enum ReservedName {
    Query = "Query",
    Mutation = "Mutation"
}
declare enum Definition {
    type = "type",
    enum = "enum",
    input = "input"
}
declare type Rule = {
    matcher: (field: DMMF.Field, model: DMMF.Model, isModelsOfSchema?: boolean, config?: Config) => boolean;
    transformer: (field: DMMF.Field) => DMMF.Field;
};
declare type CustomRules = {
    beforeAddingTypeModifiers?: Rule[];
    afterAddingTypeModifiers?: Rule[];
};
declare type ArgConfig = {
    models: string[];
    fields: string[];
};
export type { Rule, CustomRules, ArgConfig };
export { SDL, PSL, Scalar, ReservedName, Definition };
//# sourceMappingURL=types.d.ts.map