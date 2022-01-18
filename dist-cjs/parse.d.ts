import { DMMF } from '@prisma/generator-helper';
export declare type Models = {
    [name: string]: DMMF.Model;
};
export declare type Enums = {
    [name: string]: DMMF.DatamodelEnum['values'];
};
export declare class DataModel {
    dataModel: DMMF.Datamodel;
    constructor(dataModel: DMMF.Datamodel);
    get names(): string[];
    get models(): Models;
    get enums(): Enums;
}
declare const parse: (prismaSchema: string) => Promise<DataModel>;
export default parse;
