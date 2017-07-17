import config from '../../util/config';

import big from './big';
/*import confirm from './confirm';
import deny from './deny';*/
import formats from './formats';
import help from './help';
import record from './record';
import register from './register';


const { disabledCommands } = config.get('bot');

export const commands = [
  big,
  /*confirm,
  deny,*/
  formats,
  help,
  record,
  register
]
.filter(({ name }) => !disabledCommands.includes(name));

// workaround for circular reference issue
export const getCommands = () => commands;