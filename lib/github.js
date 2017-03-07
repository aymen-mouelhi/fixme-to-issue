const request = require('request');
const Promise = require('promise');
const chalk   = require('chalk');
const axios   = require('axios');
const pkg     = require('../package.json');

const GITHUB_API_URL = 'https://api.github.com/repos';

class Github {
    constructor() {
        var cleanUrl = pkg.repository.url.replace('https://github.com/', '');
        var self = this;
        this.url = pkg.repository.url;
        this.author = cleanUrl.substr(0, cleanUrl.indexOf('/'));
        this.repository = cleanUrl.substr(cleanUrl.indexOf('/'), cleanUrl.length).replace('/', '').replace('.git', '');

        if (this.repository) {
          // Get Issues
          this.getIssues().then(function(issues){
            self.issues = issues;
            console.log(chalk.yellow(`Issues: ${JSON.stringify(issues)}`));
          }).catch(function (error) {
            console.log(chalk.red(error));
          });

          // Get Contributors
          this.getContributors().then(function(contributors){
            self.contributors = contributors;
          })
        }
    }

    isRepository() {
        if (this.repository) {
            return true;
        }
        return false;
    }

    getRepository() {
        return this.repository;
    }

    // https://developer.github.com/v3/issues/#create-an-issue
    createIssue(message) {
        // TODO When an issue is created => add the issue url in the line that contains the TODO, FIXME, BUG...
        // TODO: Labels should assigned depending on the annotation: todo => todo, bug => bug, must be able to customize this list
        // options.lables = {
        //     'BUG': 'bug',
        //     'TODO': 'todos'
        // }
        console.log(`Issue "${message.message}" has been created`)
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


    getIssues(){
      var self = this;
      return new Promise(function(resolve, reject) {
        axios.get(`${GITHUB_API_URL}/${self.author}/${self.repository}/issues`)
        .then(function (response) {
          //console.log(response);
          resolve(response.data);
        })
        .catch(function (error) {
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

    isIssueClosed() {

    }

    issueExists() {

    }
}

module.exports = Github;
