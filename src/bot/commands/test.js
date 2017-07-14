/**
 * This is a test command
 * 
 * !test
 * 
 * Auto-responds with a message.
 */

export default {
  name: 'test',
  run: ({
    client,
    message,
    options
  }) => {
    message.channel.send(`It's alive!`);
  }
};