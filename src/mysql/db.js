import mysql from 'mysql';
import { promisify } from 'util';
import config from '../util/config';


const {
  host,
  port,
  user,
  password,
  database
} = config.get('mysql');

const pool = mysql.createPool({
  host,
  port
  user,
  password,
  database
});

/**
 * Performs a promisified MySQL query in the connection pool.
 *
 * @param      {Object}  options  The options object for connection.query
 * @return     {Promise<Object>}  Promise returning { results, fields }
 */
export default const query = (options) =>
  Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      connection.query(options, (error, results, fields) => {
        if (err) {
          reject(err);
          return;
        }

        resolve({
          results,
          fields
        });
      });
    })
  });