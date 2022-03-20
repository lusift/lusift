const camelCaseToHyphenCase = (camelCaseString: string) => {
  return camelCaseString.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
}

const styleObjectToString = (styleProps: Object) => {
  // convert and layout styleProps into string literal
  let stylesString = '';
  Object.keys(styleProps).forEach(key => {
    stylesString += `${camelCaseToHyphenCase(key)}: ${styleProps[key]} !important;\n`;
  });
  return stylesString;
}

export default styleObjectToString;
