import glicko2 from 'glicko2-lite';
import config from './config';
import {
  createRanking,
  getRanking
} from '../mysql/rankings';

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

/**
 * Calculates a player's new ranking using magical statistics:
 * http://www.glicko.net/glicko/glicko2.pdf
 *
 * @param      {Object}   player    The player's rating object
 * @param      {Object}   opponent  The opponent's rating object
 * @param      {Boolean}  win       Did the player win?
 * @return     {Object}   The ranking { r, rd, vol }
 */
export const calculateRanking = ({
  player,
  opponent,
  win = false
}) => {
  const {
    r: playerR,
    rd: playerRD,
    vol: playerVol
  } = player;

  const {
    r: opponentR,
    rd: opponentRD
  } = opponent;

  const winValue = win ? 1 : 0;

  const matches = [
    [opponentR, opponentRD, winValue]
  ];

  const {
    rating: r,
    rd,
    vol
  } = glicko2(playerR, playerRD, playerVol, matches);

  return {
    r,
    rd,
    vol
  };
};

/**
 * Gets or creates a new ranking for a player
 *
 * @param      {String}  arg1.discordId  The discord identifier
 * @param      {String}  arg1.format     The format
 * @return     {<type>}  The or create ranking.
 */
export const getOrCreateRanking = ({
  discordId, 
  format
}) =>
  getRanking({
    discordId,
    format
  })
  .then((ranking) => {
    let playerRanking = ranking;

    if (!playerRanking) {
      const { glickoDefaults } = config.get('rankings');
      const {
        r,
        rd,
        vol
      } = glickoDefaults;

      createRanking({
        format,
        discordId,
        r,
        rd,
        vol
      });

      return glickoDefaults;
    }

    return playerRanking;
  });