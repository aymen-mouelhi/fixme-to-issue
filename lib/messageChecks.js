const chalk  = require('chalk');

// TODO: Get messages from conf file
var annotations;

function getChalkColor(color){
  switch (color) {
    case 'grey':
      return chalk.grey;
      break;
    default:
      return chalk.blue;
      break;
  }
}

try {
  // FIXME: annotations should be an object containgin a set of objects, and not an array !
  var options  = JSON.parse(require('fs').readFileSync(require('path').resolve(__dirname, '../.fixme-to-issue'), 'utf8'));

  if(options.annotations){
    annotations = options.annotations.map(function(annotation){
      // TODO: Fix issue regarding colorer
      // annotation.colorer = getChalkColor(annotation.color);
      annotation.regex = new RegExp('/[\/\/][\/\*]\s*'+ annotation.name + '\s*(?:\(([^:]*)\))*\s*:?\s*(.*)/i').toString();
      annotation.colorer = chalk.green;
      return annotation;
    });

    //console.log(`Updated annotations: ${JSON.stringify(annotations)}`);
  }else{
    //console.log(`Options: ${JSON.stringify(options)}`);
  }
} catch (e) {
  console.log(`${e}`);
} finally {
  //annotations = annotations || {
  annotations = {
    note: {
      regex:    /[\/\/][\/\*]\s*NOTE\s*(?:\(([^:]*)\))*\s*:?\s*(.*)/i,
      label:    ' ✐ NOTE',
      colorer:  chalk.green
    },
    optimize: {
      regex:    /[\/\/][\/\*]\s*OPTIMIZE\s*(?:\(([^:]*)\))*\s*:?\s*(.*)/i,
      label:    ' ↻ OPTIMIZE',
      colorer:  chalk.blue
    },
    todo: {
      regex:    /[\/\/][\/\*]\s*TODO\s*(?:\(([^:]*)\))*\s*:?\s*(.*)/i,
      label:    ' ✓ TODO',
      colorer:  chalk.magenta
    },
    hack: {
      regex:    /[\/\/][\/\*]\s*HACK\s*(?:\(([^:]*)\))*\s*:?\s*(.*)/i,
      label:    ' ✄ HACK',
      colorer:  chalk.yellow
    },
    xxx: {
      regex:    /[\/\/][\/\*]\s*XXX\s*(?:\(([^:]*)\))*\s*:?\s*(.*)/i,
      label:    ' ✗ XXX',
      colorer:  chalk.black.bgYellow
    },
    fixme: {
      regex:    /[\/\/][\/\*]\s*FIXME\s*(?:\(([^:]*)\))*\s*:?\s*(.*)/i,
      label:    ' ☠ FIXME',
      colorer:  chalk.red
    },
    bug: {
      regex:    /[\/\/][\/\*]\s*BUG\s*(?:\(([^:]*)\))*\s*:?\s*(.*)/i,
      label:    ' ☢ BUG',
      colorer:  chalk.white.bgRed
    }
  };
}


module.exports = annotations;
