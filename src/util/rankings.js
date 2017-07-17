import config from './config';

/**
 * Gets match format object by it's code.
 *
 * @param      {String}  formatCode  The format code
 * @return     {Object}  The match format object { code, name }
 */
export const getMatchFormat = (formatCode) => {
  const { matchFormats } = config.get('rankings');
  const bigCode = formatCode.toUpperCase();
  return matchFormats.find(({ code }) => code === bigCode);
};