import { getDMMF } from '@prisma/sdk';
export class DataModel {
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
const parse = async (prismaSchema) => {
    const dmmf = await getDMMF({ datamodel: prismaSchema });
    return new DataModel(dmmf.datamodel);
};
export default parse;
//# sourceMappingURL=parse.js.map