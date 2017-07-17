import config from '../../util/config';

import big from './big';
import help from './help';


const { disabledCommands } = config.get('bot');

export const commands = [
  big,
  help
]
.filter(({ name }) => !disabledCommands.includes(name));

// workaround for circular reference issue
export const getCommands = () => commands;