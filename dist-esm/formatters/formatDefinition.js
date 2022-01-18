const formatModel = ({ type, name, fields, }) => `${type} ${name} {\n${fields.join('\n')}\n}\n`;
export default formatModel;
//# sourceMappingURL=formatDefinition.js.map