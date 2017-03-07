const request = require('request');
const Promise = require('promise');
const chalk   = require('chalk');
const packageJSON = require('../package.json');

class Github {
    constructor() {
        var cleanUrl = packageJSON.repository.url.replace('https://github.com/', '');
        this.url = packageJSON.repository.url;
        this.author = cleanUrl.substr(0, cleanUrl.indexOf('/'));
        this.repository = cleanUrl.substr(cleanUrl.indexOf('/'), cleanUrl.length).replace('/', '').replace('.git', '');
        console.log(`Url: ${this.url} - Author: ${this.author} - Repository: ${this.repository}`);
    }

    isGithubRepository() {
        // TODO: Whether the current project is a github repository or not
        if (this.url) {
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
