# fixme-to-issue
Automagically turn your code annotations (like TODO or FIXME ) to github / gitlab issues.


### Installation
```
npm install -g fixme-to-issue
```

### Usage
There are two ways to use fixme-to-issue:
- Options can be retrieved from configuration file:
  - Create a .fixme-to-issue file at the root of your folder
  - Then simply ``` fixme-to-issue ```
- Options can be passed in CLI

```
fixme-to-issue [options]
```

### Config file
Include a .fixme-to-issue in the root folder of your project and update the configuration:
```
{
  "github": {
    "username": "USERNAME",
    "password": "PASSWORD"
  },
  "prefix": "[Issue Bot]",
  "add_number_line": false,
  "annotations": [{
    "name": "NOTE",
    "label": "notes",
    "color": "green"
  },
  {
    "name": "FIXME",
    "label": "fixme",
    "color": "red"
  },
  {
    "name": "TODO",
    "label": "todos",
    "color": "magenta"
  },
  {
    "name": "BUG",
    "label": "bug",
    "color": "white.bgRed"
  },
  {
    "name": "OPTIMIZE",
    "label": "enhancements",
    "color": "blue"
  },
  {
    "name": "HACK",
    "label": "need help",
    "color": "yellow"
  },
  {
    "name": "XXX",
    "label": "need help",
    "color": "black.bgYellow"
  },
  {
    "name": "CUSTOM",
    "label": ["my custom github label", "amazing", "hard"],
    "color": "grey"
  }]
}
```

### CLI Options
    -h, --help               output usage information
    -V, --version            output the version number
    -s, --source [dir]       root directory to be included only for checks (default: current working directory)
    -x, --patterns [dir]     Path patterns to exclude (default: include all files and directories)
    -e, --encoding [type]    file encoding to be scanned (default: utf8)
    -i, --include [dir]      Path patterns to include only (default: include all files and directories). Note that include patterns will overwrite any exclude patterns
    -l, --line-length <n>    number of max characters a line (default: 1000)
    -h, --ignore-hidden <n>  ignore hidden files (default: false)
    -g, --git-ignore <n>     ignore patterns from your .gitignore file. This paramter accepts the path for the .gitIgnore file (default: false | no .gitignore is read


### Custom Annotations
You can create your own custom annotations by adding them to the .fixme-to-issue file:

Example:
```
{
  "name": "CUSTOM", // The program will look for NOTE annotations in your code
  "label": "custom github label", // Once found, the issues will be created and use this github label, it can be a string or an array of labels
  "color": "green" // The color in the console output, it has to be a chalk color
}
```
