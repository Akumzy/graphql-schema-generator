"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeDef = /* GraphQL */ `
  enum QueryMode {
    default
    insensitive
  }

  input StringFilter {
    equals: String
    in: [String]
    notIn: [String]
    lt: String
    lte: String
    gt: String
    gte: String
    contains: String
    startsWith: String
    endsWith: String
    mode: QueryMode
    not: StringFilter
  }

  input BooleanFilter {
    equals: Boolean
    not: BooleanFilter
  }

  input DateTimeFilter {
    equals: DateTime
    in: [DateTime]
    notIn: [DateTime]
    lt: DateTime
    lte: DateTime
    gt: DateTime
    gte: DateTime
    not: DateTimeFilter
  }

  input IntFilter {
    equals: Int
    in: [Int]
    notIn: [Int]
    lt: Int
    lte: Int
    gt: Int
    gte: Int
    not: IntFilter
  }
`;
exports.default = typeDef;
//# sourceMappingURL=where-filters-typedef.js.map