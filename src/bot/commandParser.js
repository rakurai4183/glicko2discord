import getCommands from './commands';
import config from '../util/config';
import { regexEscape } from '../util';

export default (client) => {
  const {
    allowedChannels,
    prefix
  } = config.get('bot');

  const _prefix = regexEscape(prefix);
  const pattern = RegExp(`^${_prefix}(\\w+)\\s*(.*)$`);
  const commands = getCommands();

  const messageHandler = message => {
    const {
      channel,
      content
    } = message;

    const { type } = channel;
    const isDM = type === 'dm';
    const isText = type === 'text';
    const isAllowedChannel = isText && allowedChannels.includes(channel.name);

    if (!isDM && !isAllowedChannel) {
      return;
    }

    const match = content.match(pattern);

    if (!match) {
      return;
    }

    const [, commandName, opts = ''] = match;
    const command = commands.find(cmd => cmd.name === commandName);

    if (command) {
      const options = opts.split(/\s+/);
      command.run({
        client,
        message,
        options
      });
    }
  };

  return messageHandler;
};