const extractId = (model) => {
    const { fields } = model;
    return fields.find(({ isId }) => isId);
};
export default extractId;
//# sourceMappingURL=extractId.js.map