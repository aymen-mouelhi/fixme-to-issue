const request = require('request');
const Promise = require('promise');
const chalk = require('chalk');
const axios = require('axios');
const execute = require('child_process').exec;
const execSync = require('child_process').execSync;
const _ = require('lodash');
const EventEmitter = require('events').EventEmitter
const paginationStream = require('pagination-stream')
const JSONStream = require('JSONStream')
const eventEmitter = new EventEmitter();

var pkg = null;

try {
    pkg = JSON.parse(require('fs').readFileSync(require('path').resolve(__dirname, '../package.json'), 'utf8'));
} catch (error) {
    console.log(chalk.red(`${error}`));
    eventEmitter.emit('githubError');
}

const GITHUB_API_URL = 'https://api.github.com/repos';

class Github {
    constructor(options) {
        var cleanUrl = pkg ? pkg.repository.url.replace('https://github.com/', '') : null;
        var self = this;
        this.issues = [];

        if (options) {
            if (options.github) {
                if (options.github.username && options.github.password) {

                    axios.defaults.auth = {
                        username: options.github.username,
                        password: options.github.password
                    }

                    this.username = options.github.username;
                    this.password = options.github.password;

                    this.annotations = options.annotations;

                } else {
                    console.log(chalk.red('You should provide your GitHub account\'s username and password to be able to create issues in Github '));
                    process.exit();
                }
            } else {
                console.log(chalk.red('You should provide your GitHub account\'s username and password to be able to create issues in Github '));
                process.exit();
            }
        }

        this.url = pkg.repository.url;
        this.author = cleanUrl.substr(0, cleanUrl.indexOf('/'));
        this.repository = cleanUrl.substr(cleanUrl.indexOf('/'), cleanUrl.length).replace('/', '').replace('.git', '');

        if (this.repository) {
            // TODO: Async waterfall and then emit event [Issue #53]
            // Get Issues
            this.getIssues().then(function(issues) {
                self.issues = issues;
                console.log(chalk.blue(`The repository has ${issues.length} issue(s)`));

                eventEmitter.emit('githubReady');
            }).catch(function(error) {
                console.log(chalk.red(error));
                eventEmitter.emit('githubError');
            });

            // Get Contributors
            this.getContributors().then(function(contributors) {
                self.contributors = contributors;
                console.log(chalk.blue(`The repository has ${contributors.length} contributor(s)`));
            }).catch(function(error) {
                console.log(chalk.red(error));
                eventEmitter.emit('githubError');
            });

            // Get Current Branch
            this.getCurrentBranch().then(function(branch) {
                self.branch = branch;
                console.log(chalk.blue(`Current Branch: ${branch}`));
            }).catch(function(error) {
                console.log(chalk.red(error));
                eventEmitter.emit('githubError');
            });

            // Get Current User
            this.getGitUser().then(function(user) {
                self.user = user;
                console.log(chalk.blue(`Current Git User: ${JSON.stringify(user)}`));
            }).catch(function(error) {
                console.log(chalk.red(error));
                eventEmitter.emit('githubError');
            });
        }
    }

    getEventEmitter() {
        return eventEmitter;
    }

    getRepository() {
        return this.repository;
    }

    getAuthor() {
        return this.author;
    }

    getLink() {
        return 'https://github.com/' + this.getAuthor() + '/' + this.getRepository();
    }

    getBranch() {
        return this.branch;
    }

    getCurrentBranch() {
        return new Promise(function(resolve, reject) {
            execute("git branch", function(err, branch) {
                if (err) {
                    reject(err);
                } else {
                    resolve(branch.replace('*', '').trim());
                }
            });
        });
    }

    getGitUser() {
        return new Promise(function(resolve, reject) {
            execute("git config --global user.name", function(err, name) {
                execute("git config --global user.email", function(err, email) {
                    if (name.toString()) {
                        name = name.replace("\n", "");
                    }

                    if (email.toString()) {
                        email = email.replace("\n", "");
                    }

                    resolve({
                        name: name,
                        email: email
                    });
                });
            });
        });
    }

    getContributors() {
        var self = this;
        return new Promise(function(resolve, reject) {
            axios.get(`${GITHUB_API_URL}/${self.author}/${self.repository}/collaborators`)
                .then(function(response) {
                    resolve(response.data);
                })
                .catch(function(error) {
                    console.log(error);
                    reject(error);
                });
        });
    }


    getIssues() {
        var self = this;
        var auth = 'Basic ' + new Buffer(this.username + ':' + this.password).toString('base64');

        return new Promise(function(resolve, reject) {
            var issues = [];

            axios.get(`${GITHUB_API_URL}/${self.author}/${self.repository}/issues?state=all&per_page=100`)
                .then(function(response) {
                    const regex = /([^_]page=([0-9]+))/g;

                    let m;
                    var last = 1;

                    while ((m = regex.exec(response.headers.link)) !== null) {
                        if (m.index === regex.lastIndex) {
                            regex.lastIndex++;
                        }

                        m.forEach((match, groupIndex) => {
                            if (parseInt(match)) {
                                if (parseInt(match) > last) {
                                    last = parseInt(match);
                                }
                            }
                        });
                    }

                    var options = {
                        urlFormat: `${GITHUB_API_URL}/${self.author}/${self.repository}/issues?page=%d&state=all&per_page=100`,
                        headers: {
                            'Authorization': auth,
                            'user-agent': 'pug'
                        },
                        start: 1,
                        end: last,
                        retries: 2
                    }

                    console.log(chalk.yellow(`Getting ${self.author}/${self.repository} Issues ...`));

                    paginationStream(options)
                        .pipe(JSONStream.parse('*'))
                        .on('data', function(data) {
                            issues.push(data);
                        })
                        .on('end', () => {
                            resolve(issues);
                        })
                        .on('error', function(error) {
                            console.log('[Github] error: ' + error);
                            reject(error);
                        });
                })
                .catch(function(error) {
                    console.log(error);

                    reject(error);
                });
        });
    }

    getContributor(name) {
        var self = this;
        return new Promise(function(resolve, reject) {
            var contributor = self.contributors.filter(function(person) {
                return person.login === name;
            });
            // TODO: return contributor github's username [Issue #95]
            if (contributor.length > 0) {
                resolve(contributor[0]);
            }
        });
    }

    isRepository() {
        if (this.repository) {
            return true;
        }
        return false;
    }


    issueExists(message) {
        var issue;
        var title = '[Issues Bot] ' + message.message;
        if (this.issues.length > 0) {
            var found = _.filter(this.issues, {
                'title': title
            });
            if (found.length > 0) {
                issue = found[0];
                return issue;
            }
        }
        return issue;
    }

    createIssue(message) {
        var labels = ["Bot"];
        var self = this;

        return new Promise(function(resolve, reject) {

            var issue = self.issueExists(message);

            if (issue) {
                console.log(chalk.yellow(`Github] Issue ${issue.number} already exists in Github`))
                reject(`[Github] Issue ${issue.number} already exists in Github`);
            } else {
                // FIXME there is an issue in lables: one item can have multiple same Labels(todos, todos, todos) [Issue #undefined]
                var found = _.find(self.annotations, function(annotation) {
                    return annotation.label.indexOf(message.label) > -1;
                });

                if (found) {
                    if (found.githubLabel) {
                        if (typeof found.githubLabel === "object") {
                            for (var i = 0; i < found.githubLabel.length; i++) {
                                labels.push(found.githubLabel[i]);
                            }
                        } else {
                            labels.push(found.githubLabel);
                        }
                    } else {
                        // Fallback to basic list
                        if (message.label.indexOf('TODO') > -1) {
                            labels.push('todos');
                        } else if (message.label.indexOf('NOTE') > -1) {
                            labels.push('notes');
                        } else if (message.label.indexOf('OPTIMIZE') > -1) {
                            labels.push('enhanchement');
                        } else if (message.label.indexOf('HACK') > -1) {
                            labels.push('hacks');
                        } else if (message.label.indexOf('FIXME') > -1) {
                            labels.push('Bug');
                        } else if (message.label.indexOf('BUG') > -1) {
                            labels.push('Bug');
                        }
                    }
                }

                // FIXME Remove dummy description, try to insert file + line number [Issue #106]
                axios.post(`${GITHUB_API_URL}/${self.author}/${self.repository}/issues`, {
                        title: '[Issues Bot] ' + message.message,
                        body: message.description,
                        labels: labels
                    })
                    .then(function(response) {
                        console.log(chalk.blue(`Issue "${message.message}" has been created`));
                        resolve(response.data);
                    })
                    .catch(function(error) {
                        console.log('[GitHub] Error post to issues: ' + error);
                        reject(error);
                    });
            }
        });
    }

    editIssue(issue) {
        return new Promise(function(resolve, reject) {
            axios.patch(`${GITHUB_API_URL}/${self.author}/${self.repository}/issues/${issue.number}`, {
                    title: issue.title,
                    description: issue.description,
                    labels: issue.labels
                })
                .then(function(response) {
                    console.log(`Issue "${issue.number}" has been closed`)
                    resolve({
                        status: response.data
                    })
                })
                .catch(function(error) {
                    console.log('[GitHub] Error closing issue: ' + error);
                    reject(error);
                });
        });
    }

    closeIssue(issue) {
        return new Promise(function(resolve, reject) {
            axios.patch(`${GITHUB_API_URL}/${self.author}/${self.repository}/issues/${issue.number}`, {
                    state: 'closed'
                })
                .then(function(response) {
                    console.log(`Issue "${issue.number}" has been closed`)
                    resolve({
                        status: response.data
                    })
                })
                .catch(function(error) {
                    console.log('[GitHub] Error closing issue: ' + error);
                    reject(error);
                });
        });
    }
}

module.exports = Github;
