import config from '../../util/config';
import { emojifyString } from '../../util';


const name = 'formats';
const optionParser = /^$/;
const shortHelp = '!formats - Shows a list of available ranked match formats';
const help = `
Usage: \`!formats\`

(no options)

Example: \`!formats\`
`;
const allowDirectMessage = true;
const allowChannelMessage = true;

const run = ({
  client,
  message,
  options: []
}) => {
  const { matchFormats } = config.get('rankings');
  const formatted = matchFormats
    .map(({code, name}) => `\`${code}\` - ${name}`)
    .join('\n');

  message.author.send(`
__Available ranked match formats:__

${formatted}
  `);
};

export default {
  name,
  optionParser,
  shortHelp,
  help,
  allowDirectMessage,
  allowChannelMessage,
  run
};