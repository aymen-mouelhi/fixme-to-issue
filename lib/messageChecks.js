const chalk = require('chalk');

// TODO: Get messages from conf file [Issue #undefined]
var annotations = {};

function getChalkColor(color) {
    switch (color) {
        case 'grey':
            return chalk.grey;
            break;
        case 'green':
            return chalk.green;
            break;
        case 'yellow':
            return chalk.yellow;
            break;
        case 'white':
            return chalk.white;
            break;
        case 'red':
            return chalk.red;
            break;
        case 'magenta':
            return chalk.magenta;
            break;
        case 'blue':
            return chalk.blue;
            break;
        default:
            return chalk.blue;
            break;
    }
}

try {
    // FIXME: annotations should be an object containgin a set of objects, and not an array ! [Issue #undefined]
    var options = JSON.parse(require('fs').readFileSync(require('path').resolve(__dirname, '../.fixme-to-issue'), 'utf8'));

    if (options.annotations) {
        options.annotations.forEach(function(annotation) {
            annotations[annotation.name.toLowerCase()] = {
                regex: new RegExp('/[\/\/][\/\*]\s*' + annotation.name + '\s*(?:\(([^:]*)\))*\s*:?\s*(.*)/i').toString(),
                label: annotation.name,
                colorer: getChalkColor(annotation.color)
            }
        });

        console.log(`Updated annotations: ${JSON.stringify(annotations)}`);
        console.log(annotations.note.colorer(`Testing colorer?`));
    } else {
        //console.log(`Options: ${JSON.stringify(options)}`);
    }
} catch (e) {
    console.log(`${e}`);
} finally {
    //annotations = annotations || {
    annotations = {
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
