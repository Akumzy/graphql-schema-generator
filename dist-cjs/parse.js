"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataModel = void 0;
const sdk_1 = require("@prisma/sdk");
class DataModel {
    constructor(dataModel) {
        this.dataModel = dataModel;
    }
    get names() {
        const { models } = this.dataModel;
        return models.map((model) => model.name);
    }
    get models() {
        const { models } = this.dataModel;
        return models.reduce((acc, model) => {
            const { name } = model;
            return { ...acc, [name]: model };
        }, {});
    }
    get enums() {
        const { enums } = this.dataModel;
        return enums.reduce((acc, cur) => {
            const { name, values } = cur;
            return { ...acc, [name]: values };
        }, {});
    }
}
exports.DataModel = DataModel;
const parse = async (prismaSchema) => {
    const dmmf = await (0, sdk_1.getDMMF)({ datamodel: prismaSchema });
    return new DataModel(dmmf.datamodel);
};
exports.default = parse;
//# sourceMappingURL=parse.js.map