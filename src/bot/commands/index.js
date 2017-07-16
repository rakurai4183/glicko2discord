import config from '../../util/config';
import big from './big';

const { disabledCommands } = config.get('bot');

const commands = [
  big
]
.filter(({ name }) => !disabledCommands.includes(name));

export default commands;