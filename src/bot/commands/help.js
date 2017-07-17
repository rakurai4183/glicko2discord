import { getCommands } from './index';


const name = 'help';
const optionParser = /(\w*)/;
const shortHelp = '!help [command] - Displays help for a command';
const help = `
Usage: \`!help [command]\`

\`command\` = the command you want help with.

Example: \`!help big\`
`;
const allowDirectMessage = true;
const allowChannelMessage = true;

const run = ({
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

export default {
  name,
  optionParser,
  shortHelp,
  help,
  allowDirectMessage,
  allowChannelMessage,
  run
};