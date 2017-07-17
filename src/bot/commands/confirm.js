import { buildEmbed } from '../../util/discord';
import {
  confirmMatch,
  getUnconfirmedMatch
} from '../../mysql/matches';
import {
  updateRanking
} from '../../mysql/rankings';
import {
  calculateRanking,
  getMatchFormat,
  getOrCreateRanking
} from '../../util/rankings';


const name = 'confirm';
const optionParser = /(\d{6})/i;
const shortHelp = '!confirm [code] - Confirm a recorded match result';
const help = `
Usage: \`!confirm [code]\`

\`code\` = the six-digit confirmation code for the match

You can only confirm a match if your opponent has \`!register\`-ed it first.
Example: \`!confirm 123456\`
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
  // Update rankings
  .then((match) => {
    if (!match) {
      return;
    }

    const {
      id,
      format,
      player1: playerOneId,
      player2: playerTwoId,
      winner
    } = match;

    return Promise.all([
      getOrCreateRanking({
        discordId: playerOneId,
        format
      }),
      getOrCreateRanking({
        discordId: playerTwoId,
        format
      })
    ])
    .then(([playerOneRank, playerTwoRank]) => ([
      calculateRanking({
        player: playerOneRank, 
        opponent: playerTwoRank,
        win: winner === 1
      }),
      calculateRanking({
        player: playerTwoRank, 
        opponent: playerOneRank,
        win: winner === 2
      })
    ]))
    .then(([playerOneNewRank, playerTwoNewRank]) => 
      Promise.all([
        updateRanking({
          discordId: playerOneId,
          format,
          r: playerOneNewRank.r,
          rd: playerOneNewRank.rd,
          vol: playerOneNewRank.vol
        }),
        updateRanking({
          discordId: playerOneId,
          format,
          r: playerTwoNewRank.r,
          rd: playerTwoNewRank.rd,
          vol: playerTwoNewRank.vol
        })
      ])
    )
    .then(() => match);
  })
  // Confirm match
  .then((match) => {
    if (!match) {
      return;
    }

    return confirmMatch({
      discordId,
      confirmationCode
    })
    .then(() => match);
  })
  // Send chat message
  .then((match) => {
    if (!match) {
      return;
    }

    const {
      id,
      format,
      player1: playerOneId,
      player2: playerTwoId,
      winner
    } = match;

    const [emojiOne, emojiTwo] = winner === 1
      ? [':medal:', ':second_place:']
      : [':second_place:', ':medal:'];

    const { name: formatName } = getMatchFormat(format);

    return channel.send(
      buildEmbed(client, {
        title: `Match result confirmed (${confirmationCode})`,
        description: `
${emojiOne} <@${playerOneId}> -vs- <@${playerTwoId}> ${emojiTwo}
**Format:** ${formatName} (\`${format}\`)
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