const doesStringMatchRegex = (str: string, regex: string): boolean => {
  // see if regex pattern matches url string (case insensitive)
  // e.g. '/.+/dashboard' matches '/lusift/dashboard'
  const regexPattern = new RegExp(regex, 'i');
  return regexPattern.test(str);
}
export default doesStringMatchRegex;
