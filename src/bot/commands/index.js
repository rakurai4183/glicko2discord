import config from '../../util/config';

// import big from './big';
// import confirm from './confirm';
// import decline from './decline';
// import formats from './formats';
import * as help from './help';
// import record from './record';
// import register from './register';
import * as status from './status';


const { disabledCommands } = config.get('bot');

export const commands = [
//  big,
//  confirm,
//  decline,
//  formats,
  help,
//  record,
//  register
  status
]
.filter(({ name }) => !disabledCommands.includes(name));

// workaround for circular reference issue
export const getCommands = () => commands;