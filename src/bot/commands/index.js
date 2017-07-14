// TODO - This is gross. Do something more ES6-y
import requireAll from 'require-all';
import config from '../../util/config';

export default () => {
  const { disabledCommands } = config.get('bot');
  const excludes = ['index', ...disabledCommands];

  const commands = requireAll({
    dirname: __dirname,
    filter: (filename) => {
      const r = RegExp('^(.*)\\.js$');
      const [, name] = filename.match(r);

      if (!excludes.includes(name)) {
        return name;
      }
    }
  });

  return Object.values(commands).map(exports => exports.default);
};