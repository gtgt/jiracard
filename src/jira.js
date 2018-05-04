import JiraClient from 'jira-connector';
import FileCookieStore from 'tough-cookie-filestore';
import request from 'request';
let jar = request.jar(new FileCookieStore('cookies.json'));
let jira = new JiraClient({
  host: 'jira.virgo.hu',
  basic_auth: {
    username: 'gere.tamas',
    password: 'xxxxxx',
  },
  cookie_jar: jar
});
import https from 'https';

export default {
  issues(project) {
    return new Promise(function(resolve, reject) {
      jira.search.search({
        jql: 'project in ('+project+') AND issuetype in standardIssueTypes() AND sprint in openSprints() ORDER BY Project DESC, resolution DESC, Rank ASC, type ASC',
        fields: ['summary', 'description', 'status', 'resolution', 'priority', 'issuetype', 'project', 'creator', 'reporter', 'assignee', 'subtasks', 'issuelinks', 'labels', 'aggregatetimeoriginalestimate', 'aggregatetimeestimate', 'aggregatetimespent', 'aggregateprogress', 'timespent', 'created', 'updated'],
      }, function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data.issues);
        }
      });
    });
  },
  issuesExample(project) {
    return new Promise(function(resolve, reject) {
      https.get('https://raw.githubusercontent.com/gtgt/jiracard/master/example.json', (res) => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];

        let error;
        if (statusCode !== 200) {
          error = new Error('Request Failed.\n' +
                            `Status Code: ${statusCode}`);
        } else if (!/^(application\/json|text\/plain)/.test(contentType)) {
          error = new Error('Invalid content-type.\n' +
                            `Expected application/json but received ${contentType}`);
        }
        if (error) {
          console.error(error.message);
          // consume response data to free up memory
          res.resume();
          return;
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData);
            resolve(parsedData.issues);
          } catch (e) {
            console.error(e.message);
          }
        });
      }).on('error', (e) => {
        reject(e.message);
      });
    });
  }
}