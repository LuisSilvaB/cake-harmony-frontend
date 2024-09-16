export const upperLowerCase = (str: string) => {
  return str.toLowerCase().replace(/(?:^|\s|["'([{])+\S/g, (match) => match.toUpperCase())
}