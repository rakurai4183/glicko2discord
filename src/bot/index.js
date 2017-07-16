import Discord from 'discord.js';
import createCommandParser from './commandParser';
import config from '../util/config';


const { apiToken } = config.get('bot');

const client = new Discord.Client();

client.on('ready', () => {
  console.log('Bot is running.');
});

client.on('message', createCommandParser(client));

client.login(apiToken);