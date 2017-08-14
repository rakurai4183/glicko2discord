import { getCommands } from './index';


export const name = 'help';

export const optionParser = /(\w*)/;

export const shortHelp = '!help [command] - Displays help for a command';

export const help = `
Usage: \`!help [command]\`

\`command\` = the command you want help with.

Example: \`!help big\`
`;

export const allowDirectMessage = true;

export const allowChannelMessage = true;

export const run = ({
  client,
  message,
  options: [commandName]
}) => {
  const { author } = message;
  const commands = getCommands();

  if (!commandName) {
    const shortHelps = commands.map(command => command.shortHelp);

    message.author.send(`\`\`\`
${shortHelps.join('\n')}
\`\`\``);
  } else {
    const command = commands.find(cmd => cmd.name === commandName);

    if (command) {
      author.send(command.help);
    } else {
      author.send(`Command ${commandName} does not exist.`);
    }
  }
};