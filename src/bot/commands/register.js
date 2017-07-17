import { updatePlayer } from '../../mysql/players';

const name = 'register';
const optionParser = /^$/;
const shortHelp = '!register - Register for ranked play (or use to update your name if already registered)';
const help = `
Usage: \`!register\`

(no options)

Example: \`!register\`
`;
const allowDirectMessage = false;
const allowChannelMessage = true;

const run = ({
  client,
  message,
  options
}) => {
  const {
    author,
    channel
  } = message;
  const {
    id: discordId,
    username: name
  } = author;

  // TODO: Enable guild nickname for use as player name

  updatePlayer({
    discordId,
    name
  })
  .then(() =>
    channel.send(`Created/Updated registration for player: <@${discordId}>!`)
  )
  .catch(console.error);
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