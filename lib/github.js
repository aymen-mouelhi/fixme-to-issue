const request = require('request');
const package = require('../package.json');

class Github {
    constructor(){
      // FIXME this part is not correct
      this.url = package.repository.url;
      var cleanUrl = this.url.replace('https://github.com/', '');
      this.author = cleanUrl.substr(0, cleanUrl.indexOf('/'));
      this.repository = cleanUrl.substr(cleanUrl.indexOf('/'), cleanUrl.length);
    }

    isGithubRepository(){
      // TODO: Whether the current project is a github repository or not
      if(this.url){
        return true;
      }
      return false;
    }

    getRepository(){
      return this.repository;
    }

    // https://developer.github.com/v3/issues/#create-an-issue
    createIssue(issue){
        // TODO When an issue is created => add the issue url in the line that contains the TODO, FIXME, BUG...
        // TODO: Labels should assigned depending on the annotation: todo => todo, bug => bug, must be able to customize this list
        // options.lables = {
        //     'BUG': 'bug',
        //     'TODO': 'todos'
        // }

    }

    getContributors(){
      // TODO: use promise?
      // TODO: Get list of contributors for cuurent project
      // /repos/:owner/:repo/collaborators
      // curl -u aymen-mouelhi https://api.github.com/repos/aymen-mouelhi/adminMongo/collaborators
    }

    getContributor(name){
      // TODO: use promise?
      getContributors().then(function(contributors){
        var contributor = contributors.filter(function(person){
          return person.login === name;
        });
        // TODO: return contributor github's username
        if(contributor.length > 0){
          resolve(contributor[0]);
        }
      })

    }

    isIssueClosed(){

    }

    issueExists(){

    }
}

export default Github;
