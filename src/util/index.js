export const regexEscape = str => 
  str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');