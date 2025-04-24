export const toPascalCase = (str: string) =>
  str.replace(/(^\w|[\s._-]\w)/g, (match) => match.replace(/[\s._-]/, '').toUpperCase());
