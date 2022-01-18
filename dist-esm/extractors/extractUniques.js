const extractUniques = (model) => {
    return model.fields.filter(({ isUnique }) => isUnique);
};
export default extractUniques;
//# sourceMappingURL=extractUniques.js.map