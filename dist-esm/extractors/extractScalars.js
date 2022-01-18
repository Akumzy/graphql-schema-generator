import { Scalar, PSL } from '../converters/types';
const extractScalars = (dataModel) => {
    const { models, names } = dataModel;
    const scalars = new Set();
    names.forEach((name) => {
        const model = models[name];
        model.fields.forEach((field) => {
            const { type } = field;
            if (type === PSL.DateTime) {
                scalars.add(Scalar.DateTime);
            }
            if (type === PSL.Bytes) {
                scalars.add(Scalar.ByteArray);
            }
        });
    });
    return Array.from(scalars.values());
};
export default extractScalars;
//# sourceMappingURL=extractScalars.js.map