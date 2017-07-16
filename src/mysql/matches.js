import query from './db';


/**
 * Creates a new match.
 *
 * @param      {Number}  timestamp  UNIX timestamp
 * @param      {String}  format  The game format
 * @param      {Number}  player1  Player 1's discord ID
 * @param      {Number}  player2  Player 2's discord ID
 * @param      {Number}  winner  Winner (1, 2, 3 = tie)
 * @param      {String}  confirmationCode  Random confirmation code
 * @return     {Promise} Resolves if successful.
 */
export const createMatch = ({
  timestamp,
  format,
  player1,
  player2,
  winner,
  comfirmationCode
}) =>
  query({
    query: `
    INSERT INTO matches
      (timestamp, format, player1, player2, winner, confirmationcode, confirmed)
    VALUES
      (?, ?, ?, ?, ?, ?, 0)
    ;`,
    values: [timestamp, format, player1, player2, winner, confirmationCode]
  });

/**
 * Confirms the outcome of a match.
 *
 * @param      {Number}  discordId  Player 2's discord ID
 * @param      {Number}  confirmationCode  Random confirmation code
 * @return     {Promise} Resolves if successful.
 */
export const confirmMatch = ({
  discordId,
  comfirmationCode
}) =>
  query({
    query: `
    UPDATE matches
      (confirmed)
    VALUES
      (1)
    WHERE
      player2 = ?
      AND
      confirmationcode = ?
      AND
      confirmed = 0
    ;`,
    values: [discordId, confirmationCode]
  });
