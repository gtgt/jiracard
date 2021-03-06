import JiraClient from 'jira-connector';
import FileCookieStore from 'tough-cookie-filestore';
import request from 'request';
let jar = request.jar(new FileCookieStore('tmp/cookies.json'));
let jira = new JiraClient({
  protocol: 'https',
  authApiVersion: '1',
  host: 'jira.virgo.hu',
  basic_auth: {
    username: 'x',
    password: 'x',
  },
  cookie_jar: jar
});
import https from 'https';

export default {
  jira: jira,
  projects() {
    return new Promise(function(resolve, reject) {
      jira.project.getAllProjects({}).then((data) => {
        resolve(data.projects);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  issues(project) {
    return new Promise(function(resolve, reject) {
      jira.search.search({
        jql: 'project in ('+project+') AND issuetype in standardIssueTypes() AND sprint in openSprints() ORDER BY Project DESC, resolution DESC, Rank ASC, type ASC',
        fields: ['summary', 'description', 'status', 'resolution', 'priority', 'issuetype', 'project', 'creator', 'reporter', 'assignee', 'subtasks', 'issuelinks', 'labels', 'aggregatetimeoriginalestimate', 'aggregatetimeestimate', 'aggregatetimespent', 'aggregateprogress', 'timespent', 'created', 'updated'],
      }).then((data) => {
        resolve(data.issues);
      }).catch((err) => {
        reject(err);
      });
    });
  }
}
