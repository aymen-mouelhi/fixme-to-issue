'use strict';

var minimist      = require('minimist'),
    fixmeToIssue  = require('./index.js'),
    pkg           = require('../package');

// TODO Update Usage + README [Issue #104]
function help() {
  return '\
Usage:\n\
\n\
  fixme-to-issue [options] [file|glob ...]\n\
\n\
Options:\n\
\n\
  -h, --help                 output usage information\n\
  -v, --version              output version\n\
  -p, --path                 path to scan (default: process.cwd())\n\
  -i, --ignored_directories  glob patterns for directories to ignore (default: node_modules/**, .git/**, .hg/**)\n\
  -e, --file_encoding        file encoding to be scanned (default: utf8)\n\
  -l, --line_length_limit    number of max characters a line (default: 1000)\n\
  -s, --skip                 list of checks to skip (default: none)\n\
\n\
Examples:\n\
\n\
  By default:\n\
\n\
    fixme\n\
\n\
  Some ignored directories and some including files:\n\
\n\
    fixme-to-issue -i \'node_modules/**\' -i \'.git/**\' -i \'build/**\' \'src/**/*.js\' \'test/*\' \n\
';
}
try {
  var fixmeOptions  = JSON.parse(require('fs').readFileSync(require('path').resolve(__dirname, '../.fixme-to-issue'), 'utf8'));
} catch (e) {
  console.log(`${e}`);
} finally {
  fixmeOptions = fixmeOptions || {
    github: {
      username: '',
      password: ''
    }
  }
}


var argv = minimist(process.argv.slice(2));

if (argv.version || argv.v) {
  console.log(pkg.version);
  process.exit();
}

if (argv.help || argv.h) {
  console.log(help());
  process.exit();
}

var options = {};

var path = argv.path || argv.p;
if (path) {
  options.path = path;
}

var ignored_directories = argv.ignored_directories || argv.i || fixmeOptions.ignored_directories;
if (typeof ignored_directories === 'string') {
  ignored_directories = [ignored_directories];
}

if (ignored_directories) {
  options.ignored_directories = ignored_directories.map(function (directory) {
    var added = '';
    if (directory.indexOf('*') < 0 ) {
      var last = directory[directory.length -1];  
      if (last === '/'){
        added = '**';
      }else{
        added = '/**';
      }

      directory+= added;
    }

    return directory;
  });
}

console.log(`Ignored directories ${JSON.stringify(options.ignored_directories)}`)

var file_patterns = argv._;
if (file_patterns.length > 0) {
  options.file_patterns = file_patterns;
}

var file_encoding = argv.file_encoding || argv.e;
if (file_encoding) {
  options.file_encoding = file_encoding;
}

var line_length_limit = argv.line_length_limit || argv.l;
if (line_length_limit) {
  options.line_length_limit = line_length_limit;
}

var skip = argv.skip || argv.s;
if (typeof skip === 'string') {
  skip = [skip];
}
if (skip) {
  options.skip = skip;
}

if(!options.github){
  options.github = {};
}

var username = argv.github_username || argv.u || fixmeOptions.github ? fixmeOptions.github.username : null;
if (username) {
  options.github.username = username;
}

var password = argv.github_password || argv.p || fixmeOptions.github ? fixmeOptions.github.password : null;
if (password) {
  options.github.password = password;
}

// Github labels
var lables = argv.lables || argv.l;
if (lables) {
  options.lables = JSON.parse(lables);
}


// Set prefix
var prefix = argv.prefix || argv.prefix || fixmeOptions.prefix ? fixmeOptions.prefix : null;;
options.prefix = prefix || '[Issue Bot]';

fixmeToIssue(options);
