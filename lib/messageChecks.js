const chalk = require('chalk');
var annotations = {};

function getChalkColorer(color){
  if(color.indexOf('.') > 0){
    var c = color.split('.');
    return chalk[c[0]][c[1]];
  }else{
    return chalk[color];
  }
}

try {
    var options = JSON.parse(require('fs').readFileSync(require('path').resolve(__dirname, '../.fixme-to-issue'), 'utf8'));

    if (options.annotations) {
        options.annotations.forEach(function(annotation) {
          var regex = new RegExp("[\/\/][\/\\*]\\s*"+ annotation.name +"\\s*(?:\\(([^:]*)\\))*\\s*:?\\s*(.*)", "i");
          annotations[annotation.name.toLowerCase()] = {
            regex: regex,
            label: annotation.name,
            colorer: getChalkColorer(annotation.color)
          }
        });
    }
} catch (e) {
    console.log(`${e}`);
} finally {
    annotations = annotations || {
        note: {
            regex: /[\/\/][\/\*]\s*NOTE\s*(?:\(([^:]*)\))*\s*:?\s*(.*)/i,
            label: ' ✐ NOTE',
            colorer: chalk.green
        },
        optimize: {
            regex: /[\/\/][\/\*]\s*OPTIMIZE\s*(?:\(([^:]*)\))*\s*:?\s*(.*)/i,
            label: ' ↻ OPTIMIZE',
            colorer: chalk.blue
        },
        todo: {
            regex: /[\/\/][\/\*]\s*TODO\s*(?:\(([^:]*)\))*\s*:?\s*(.*)/i,
            label: ' ✓ TODO',
            colorer: chalk.magenta
        },
        hack: {
            regex: /[\/\/][\/\*]\s*HACK\s*(?:\(([^:]*)\))*\s*:?\s*(.*)/i,
            label: ' ✄ HACK',
            colorer: chalk.yellow
        },
        xxx: {
            regex: /[\/\/][\/\*]\s*XXX\s*(?:\(([^:]*)\))*\s*:?\s*(.*)/i,
            label: ' ✗ XXX',
            colorer: chalk.black.bgYellow
        },
        fixme: {
            regex: /[\/\/][\/\*]\s*FIXME\s*(?:\(([^:]*)\))*\s*:?\s*(.*)/i,
            label: ' ☠ FIXME',
            colorer: chalk.red
        },
        bug: {
            regex: /[\/\/][\/\*]\s*BUG\s*(?:\(([^:]*)\))*\s*:?\s*(.*)/i,
            label: ' ☢ BUG',
            colorer: chalk.white.bgRed
        }
    };
}


module.exports = annotations;
