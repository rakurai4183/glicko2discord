import Discord from 'discord.js';
import commandParser from './commandParser';
import config from '../util/config';


const { apiToken } = config.get('bot');

const client = new Discord.Client();

client.on('ready', () => {
  console.log('Bot is running.');
});

client.on('message', commandParser(client));

client.login(apiToken);