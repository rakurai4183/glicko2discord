import { buildEmbed } from '../../util/discord';
import { createMatch } from '../../mysql/matches';
import { getPlayerById } from '../../mysql/players';
import {
  getMatchFormat,
  parseWinLoss
} from '../../util/rankings';
import { randomCode } from '../../util';
import moment from 'moment';


const name = 'record';
const optionParser = /(\w+)\s+([WLwl]{1,10}|\d+\-\d+)\s+/i;
const shortHelp = '!record [format] [wins/losses] [@Opponent] - Record a ranked match result';
const help = `
Usage: \`!record [format] [wins/losses] [@Opponent]\`

\`format\`       = a valid matchmaking format (see \`!formats\` for a list)
\`wins/losses\`  = up to 10 match results in this format: \`WWLW\` (W = win) (L = loss)
\`wins/losses\`  = up to 10 match results in this format: \`2-1\` (2 wins 1 loss)
\`@Opponent\`    = a mention of the opponent you played against

Example: \`!record TA8 WWWWLWLW @_nderscore\`

To record 8 games: (win win win win loss win loss win) in Tetris Attack Speed 8 against _nderscore

Example: \`!record TA8 6-2 @_nderscore\`

To record 6 wins and 2 losses.
`;
const allowDirectMessage = false;
const allowChannelMessage = true;

const run = ({
  client,
  message,
  options: [format, winLossString]
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

  // Check that players don't match
  // if (playerOneId === playerTwoId) {
  //   author.send(
  //     `You can't play a match against yourself! :stuck_out_tongue:`
  //   );
  //   return;
  // }

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

  const {
    wins,
    losses,
    total
  } = parseWinLoss(winLossString);

  if (total === 0) {
    author.send(
      `Invalid use of record. You can't record 0 games.`
    );
    return;
  }

  if (total > 10) {
    author.send(
      `Invalid use of record. You can't record more than 10 games at once.`
    );
    return;
  }

  if (isNaN(wins) || isNaN(losses) || isNaN(total)) {
    author.send(
      `Something went horribly wrong. :(`
    );
    return;
  }

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

    // Create a new match
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    
    return createMatch({
      timestamp,
      format: formatCode,
      player1: playerOneId,
      player1wins: wins,
      player2: playerTwoId,
      player2wins: losses,
      confirmationCode
    })
  })
  // Send chat message
  .then(() => {
    const icon_url = client.user.avatarURL;

    return channel.send(
      buildEmbed(client, {
        title: 'New Match Recorded',
        description: `
<@${playerOneId}> **(${wins})** - **(${losses})** <@${playerTwoId}> 

**Format:** ${formatName} (\`${formatCode}\`)

<@${playerTwoId}>, please type \`!confirm ${confirmationCode}\` to confirm the result of this match.
Both players can type \`!decline ${confirmationCode}\` to decline this match result.
`
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