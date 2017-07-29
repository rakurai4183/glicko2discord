import { buildEmbed } from '../../util/discord';
import { createMatch } from '../../mysql/matches';
import { getPlayerById } from '../../mysql/players';
import { getMatchFormat } from '../../util/rankings';
import { randomCode } from '../../util';
import moment from 'moment';


const name = 'record';
const optionParser = /(\w+)\s+(win|lose)\s+/i;
const shortHelp = '!record [format] [win/lose] [@Opponent] - Record a ranked match result';
const help = `
Usage: \`!record [format] [win/lose] [@Opponent]\`

\`format\`    = a valid matchmaking format (see \`!formats\` for a list)
\`win/lose\`  = whether you won or lost the match
\`@Opponent\` = a mention of the opponent you played against

Example: \`!record TA8 lose @_nderscore\`
`;
const allowDirectMessage = false;
const allowChannelMessage = true;

const run = ({
  client,
  message,
  options: [format, winLose]
}) => {
  const {
    author,
    channel,
    mentions
  } = message;
  const {
    id: playerOneId,
    username: playerOneName
  } = author;

  // Get player two's ID from mentions
  const mentionArray = mentions && mentions.users && mentions.users.array();

  if (!mentionArray || mentionArray.length !== 1) {
    author.send(
      `Invalid use of record. No opponent mentioned or too many opponents mentioned.`
    );
    return;
  }

  const [playerTwo] = mentionArray;
  const {
    id: playerTwoId,
    username: playerTwoName
  } = playerTwo;

  const winner = winLose.toLowerCase() === 'win' ? 1 : 2;

  // Check that players don't match
  if (playerOneId === playerTwoId) {
    author.send(
      `You can't play a match against yourself! :stuck_out_tongue:`
    );
    return;
  }

  // Check that format is valid
  const formatObject = getMatchFormat(format);

  if (!formatObject) {
    author.send(
      `Invalid use of record. Match format ${format} doesn't exist.
Check \`!formats\`.`
    );
    return;
  }

  const {
    code: formatCode,
    name: formatName
  } = formatObject;

  const confirmationCode = randomCode(6);

  // Check that both players are registered
  Promise.all([
    getPlayerById({ discordId: playerOneId }),
    getPlayerById({ discordId: playerTwoId })
  ])
  .then(([playerOne, playerTwo]) => {
    if (!playerOne) {
      author.send(
        `You are not currently registered for ranked play.
Use \`!register\` first.`
      );
      return false;
    }

    if (!playerTwo) {
      author.send(
        `Your opponent is not registered for ranked play.
Tell them to use \`!register\` first.`
      );
      return false;
    }

    return true;
  })
  // Create a new match
  .then((success) => {
    if (!success) {
      return false;
    }

    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    
    return createMatch({
      timestamp,
      format: formatCode,
      player1: playerOneId,
      player2: playerTwoId,
      winner,
      confirmationCode
    });
  })
  // Send chat message
  .then(() => {
    const [emojiOne, emojiTwo] = winner === 1
      ? [':medal:', ':second_place:']
      : [':second_place:', ':medal:'];

    const icon_url = client.user.avatarURL;

    return channel.send(
      buildEmbed(client, {
        title: 'New Match Recorded',
        description: `**Format:** ${formatName} (\`${formatCode}\`)`,
        fields: [
          {
            name: `${emojiOne} ${playerOneName} -vs- ${playerTwoName} ${emojiTwo}`,
            value: `
<@${playerTwoId}>, please type \`!confirm ${confirmationCode}\` to confirm the result of this match.
Both players can type \`!decline ${confirmationCode}\` to decline this match result.`
          }
        ]
      })
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