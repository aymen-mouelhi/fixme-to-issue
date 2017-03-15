// NOTE: This is the sample output for a note! [Issue #92]
// OPTIMIZE (aymen mouelhi): This is the sample output for an optimize with an author! [Issue #94]
// TODO: This is the sample output for a todo! [Issue #97]
// HACK: This is the sample output for a hack! Don't commit hacks! [Issue #91]
// XXX: This is the sample output for a XXX! XXX's need attention too! [Issue #100]
// FIXME (aymen mouelhi): This is the sample output for a fixme! Seriously fix this... [Issue #96]
// BUG: This is the sample output for a bug! Who checked in a bug?! [Issue #88]

require('../lib/')({
  path:                 process.cwd(),
  ignored_directories:  ['node_modules/**', '.git/**'],
  file_patterns:        ['**/annotate.github.js'],
  file_encoding:        'utf8',
  line_length_limit:    1000
});
