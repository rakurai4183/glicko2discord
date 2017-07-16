import { emojifyString } from '../../util';

const name = 'big';
const optionParser = /(.+)/;
const shortHelp = '*!big [text]* - Converts text into big emoji characters.';
const help = `
Usage: *!big [text]*

*text* = the text to be converted.
`;
const allowDirectMessage = true;
const allowChannelMessage = true;

const run = ({
  client,
  message,
  options: [text]
}) => {
  const response = emojifyString(text);
  message.channel.send(response);
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