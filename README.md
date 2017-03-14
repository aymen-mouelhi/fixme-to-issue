# fixme-to-issue
Automagically turn your code annotations (like TODO or FIXME ) to github / gitlab issues.


### Installation
```
npm install -g fixme-to-issue
```

### Usage
```
fixme-to-issue [options]
```

### Options
    -h, --help               output usage information
    -V, --version            output the version number
    -s, --source [dir]       root directory to be included only for checks (default: current working directory)
    -x, --patterns [dir]     Path patterns to exclude (default: include all files and directories)
    -e, --encoding [type]    file encoding to be scanned (default: utf8)
    -i, --include [dir]      Path patterns to include only (default: include all files and directories). Note that include patterns will overwrite any exclude patterns
    -l, --line-length <n>    number of max characters a line (default: 1000)
    -h, --ignore-hidden <n>  ignore hidden files (default: false)
    -g, --git-ignore <n>     ignore patterns from your .gitignore file. This paramter accepts the path for the .gitIgnore file (default: false | no .gitignore is read

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
    "color": "grey"
  },
  {
    "name": "FIXME",
    "label": "fixme",
    "color": "grey"
  },
  {
    "name": "TODO",
    "label": "todos",
    "color": "grey"
  },
  {
    "name": "BUG",
    "label": "bug",
    "color": "grey"
  },
  {
    "name": "OPTIMIZE",
    "label": "enhancements",
    "color": "grey"
  },
  {
    "name": "HACK",
    "label": "need help",
    "color": "grey"
  },
  {
    "name": "CUSTOM",
    "label": "my custom github label",
    "color": "grey"
  }]
}

```
