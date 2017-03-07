// NOTE: This is the sample output for a note!
// OPTIMIZE (aymen mouelhi): This is the sample output for an optimize with an author!
// TODO: This is the sample output for a todo!
// HACK: This is the sample output for a hack! Don't commit hacks!
// XXX: This is the sample output for a XXX! XXX's need attention too!
// FIXME (aymen mouelhi): This is the sample output for a fixme! Seriously fix this...
// BUG: This is the sample output for a bug! Who checked in a bug?!

require('../lib/')({
  path:                 process.cwd(),
  ignored_directories:  ['node_modules/**', '.git/**'],
  file_patterns:        ['**/annotate.github.js'],
  file_encoding:        'utf8',
  line_length_limit:    1000
});
