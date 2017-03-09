const request = require('request');
const Promise = require('promise');
const chalk   = require('chalk');
const axios   = require('axios');
const execute = require('child_process').exec;
const _       = require('lodash');
const pkg     = require('../package.json');

const GITHUB_API_URL = 'https://api.github.com/repos';

class Github {
    constructor(options) {
        var cleanUrl = pkg.repository.url.replace('https://github.com/', '');
        var self = this;
        this.issues = [];

        if (options) {
            if (options.username && options.password) {
                axios.defaults.auth = {
                    username: options.username,
                    password: options.password
                }
            } else {
                // TODO: SHould scan be allowed if no github info provided?
                console.log(chalk.red('You should provide your GitHub account\'s username and password to be able to create issues in Github '));
                process.exit();
            }
        }

        this.url = pkg.repository.url;
        this.author = cleanUrl.substr(0, cleanUrl.indexOf('/'));
        this.repository = cleanUrl.substr(cleanUrl.indexOf('/'), cleanUrl.length).replace('/', '').replace('.git', '');

        if (this.repository) {
            // Get Issues
            this.getIssues().then(function(issues) {
                self.issues = issues;
                //console.log(chalk.yellow(`Issues: ${JSON.stringify(issues)}`));
            }).catch(function(error) {
                //console.log(chalk.red(error));
            });

            // Get Contributors
            this.getContributors().then(function(contributors) {
                self.contributors = contributors;
            });

            // Get Current Branch
            this.getCurrentBranch().then(function(branch) {
                self.branch = branch;
                console.log(chalk.yellow(`Current Branch: ${branch}`));
            }).catch(function(error) {
                console.log(chalk.red(error));
            });

            // Get Current User
            this.getGitUser().then(function(user) {
                self.user = user;
                console.log(chalk.yellow(`Current Git User: ${JSON.stringify(user)}`));
            }).catch(function(error) {
                console.log(chalk.red(error));
            });
        }
    }

    getRepository() {
        return this.repository;
    }

    getCurrentBranch() {
        return new Promise(function(resolve, reject) {
          resolve('master');
          /*
            execute("git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/'", function(branch) {
                resolve(branch)
            });
            */
        });
    }

    getGitUser() {
        return new Promise(function(resolve, reject) {
            execute("git config --global user.name", function(name) {
                execute("git config --global user.email", function(email) {
                  if (name) {
                    name = name.replace("\n", "");
                  }

                  if(email){
                    email =  email.replace("\n", "");
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
        return new Promise(function(resolve, reject) {
            // TODO: Get list of contributors for cuurent project
            // /repos/:owner/:repo/collaborators
            // curl -u aymen-mouelhi https://api.github.com/repos/aymen-mouelhi/adminMongo/collaborators
            // Authenticate using ssh key?
            resolve([]);
        });
    }


    getIssues() {
        var self = this;
        return new Promise(function(resolve, reject) {
            axios.get(`${GITHUB_API_URL}/${self.author}/${self.repository}/issues`)
                .then(function(response) {
                    //console.log(response);
                    resolve(response.data);
                })
                .catch(function(error) {
                    console.log(error);
                    reject(error);
                });
        });
    }

    getContributor(name) {
        return new Promise(function(resolve, reject) {
            getContributors().then(function(contributors) {
                var contributor = contributors.filter(function(person) {
                    return person.login === name;
                });
                // TODO: return contributor github's username
                if (contributor.length > 0) {
                    resolve(contributor[0]);
                }
            })
        });
    }

    isRepository() {
        if (this.repository) {
            return true;
        }
        return false;
    }

    isIssueClosed() {

    }

    issueExists(message) {
      var issue;
      var title = '[Issues Bot] ' + message.message;
      if (this.issues.length > 0) {
        var found = _.filter(this.issues, { 'title': title, 'state': 'open' });
        if(found.length > 0){
          issue = found[0];
          console.log(`The issue corresponsds to issue #${issue.number}`);
          return true;
        }
      }
      return false;
    }

    // https://developer.github.com/v3/issues/#create-an-issue
    createIssue(message) {
        //FIXME there is an issue in lables: one item can have multipel same Labels(todos, todos, todos)
        // TODO When an issue is created => add the issue url in the line that contains the TODO, FIXME, BUG...
        // TODO: Labels should assigned depending on the annotation: todo => todo, bug => bug, must be able to customize this list
        // options.lables = {
        //     'BUG': 'bug',
        //     'TODO': 'todos'
        // }

        var labels = [];
        var self = this;

        if (message.label.indexOf('TODO') > 0) {
          labels.push('todos');
        }else if (message.label.indexOf('NOTE') > 0) {
          labels.push('notes');
        }else if (message.label.indexOf('OPTIMIZE') > 0) {
          labels.push('enhanchement');
        }else if (message.label.indexOf('HACK') > 0) {
          labels.push('hacks');
        }else if (message.label.indexOf('FIXME') > 0) {
          labels.push('Bug');
        }else if (message.label.indexOf('BUG') > 0) {
          labels.push('Bug');
        }

        return new Promise(function(resolve, reject) {
          // TODO: check that issue doesn't exist already, otherwize update the body and reference new found place
          axios.post(`${GITHUB_API_URL}/${self.author}/${self.repository}/issues`, {
                  title: '[Issues Bot] ' + message.message,
                  body: 'description for issue should be inserted here, it should be extracted from the line just after the issue declaration',
                  labels: labels
              })
              .then(function(response) {
                  //TODO: Get more information about the created issue
                  console.log(`Issue "${message.message}" has been created`)
                  resolve({
                    status: response.data
                  })
              })
              .catch(function(error) {
                  console.log('[GitHub] Error post to issues: ' + error);
                  reject(error);
              });
        });
    }

    editIssue(issue){
      // PATCH /repos/:owner/:repo/issues/:number
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

    closeIssue(issue){
      // PATCH /repos/:owner/:repo/issues/:number
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
