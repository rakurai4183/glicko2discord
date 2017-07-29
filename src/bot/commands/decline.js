import { buildEmbed } from '../../util/discord';
import {
  deleteMatch,
  getUnconfirmedMatch
} from '../../mysql/matches';
import { getMatchFormat } from '../../util/rankings';


const name = 'decline';
const optionParser = /(\d{6})/i;
const shortHelp = '!decline [code] - Cancel a recorded match result';
const help = `
Usage: \`!decline [code]\`

\`code\` = the six-digit confirmation code for the match

You must be one of the players in the match to deny the result.

Example: \`!decline 123456\`
`;
const allowDirectMessage = false;
const allowChannelMessage = true;

const run = ({
  client,
  message,
  options: [confirmationCode]
}) => {
  const {
    author,
    channel
  } = message;
  const {
    id: discordId,
    username: playerName
  } = author;

  // Find the unconfirmed match
  getUnconfirmedMatch({
    discordId,
    confirmationCode
  })
  .then((match) => {
    if (!match) {
      author.send(
        `Match with code ${confirmationCode} not found or already declined/confirmed.`
      );
      return false;
    }
    return match;
  })
  // Delete match
  .then((match) => {
    if (!match) {
      return;
    }

    const {
      id,
      format,
      player1: playerOneId,
      player1wins,
      player2: playerTwoId,
      player2wins
    } = match;

    const {
      code: formatCode,
      name: formatName
    } = getMatchFormat(format);

    return deleteMatch({ id })
      // Send success chat message
      .then(() =>
        channel.send(
          buildEmbed(client, {
            title: `Match result cancelled (${confirmationCode})`,
            description: `
~~<@${playerOneId}> **(${player1wins})** - **(${player2wins})** <@${playerTwoId}>~~

**Format:** ${formatName} (\`${formatCode}\`)

Declined by **${playerName}**
`
          })
        )
      );
  })
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