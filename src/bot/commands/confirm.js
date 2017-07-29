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

    if (match.player1 === discordId) {
      author.send(
        `Only your opponent can confirm this match.`
      );
    }

    // Update rankings

    const {
      id,
      format,
      player1: playerOneId,
      player1wins,
      player2: playerTwoId,
      player2wins
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
    .then(([playerOneRank, playerTwoRank]) => {
      const playerOneNewRank = calculateRanking({
        player: playerOneRank, 
        opponent: playerTwoRank,
        wins: player1wins,
        losses: player2wins
      });
      const playerTwoNewRank = calculateRanking({
        player: playerTwoRank, 
        opponent: playerOneRank,
        wins: player2wins,
        losses: player1wins
      });

      return Promise.all([
        updateRanking({
          discordId: playerOneId,
          format,
          r: playerOneNewRank.r,
          rd: playerOneNewRank.rd,
          vol: playerOneNewRank.vol
        }),
        updateRanking({
          discordId: playerTwoId,
          format,
          r: playerTwoNewRank.r,
          rd: playerTwoNewRank.rd,
          vol: playerTwoNewRank.vol
        })
      ])
      .then((res) => Promise.resolve({
        match,
        playerOneRating: Math.round(playerOneNewRank.r),
        playerTwoRating: Math.round(playerTwoNewRank.r)
      }));
    });
  })
  // Confirm match
  .then((result) => {
    if (!result) {
      return;
    }

    return confirmMatch({
      discordId,
      confirmationCode
    })
    .then((res) => Promise.resolve(result));
  })
  // Send chat message
  .then((result) => {
    if (!result) {
      return;
    }

    const {
      match,
      playerOneRating,
      playerTwoRating
    } = result;

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

    return channel.send(
      buildEmbed(client, {
        title: `Match result confirmed (${confirmationCode})`,
        description: `
<@${playerOneId}> **(${player1wins})** - **(${player2wins})** <@${playerTwoId}>

**Format:** ${formatName} (\`${formatCode}\`)

 <@${playerOneId}> New ${formatCode} Rating: **${playerOneRating}**

 <@${playerTwoId}> New ${formatCode} Rating: **${playerTwoRating}** 
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