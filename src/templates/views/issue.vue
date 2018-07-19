<!--suppress HtmlUnknownTag, HtmlUnknownAttribute, CheckEmptyScriptTag, CssUnknownProperty -->
<template>
  <box top="center" left="center" width="75%" :height="20" :keys="true" :mouse="true"
       :border="{ type: 'line' }" :style="{ border: { fg: 'green' } }"
       :label="' IssueView: '+issue.key+' '"
  >
    <listtable :data="issueDetails" columnWidth="20" width="90%" :top="1" :right="11" :left="1" :height="16" align="left" />
    <image v-if="picture" :file="picture" :width="30" :height="15" :right="1" :top="1" style="bg: #3FA767; fg: #F9EC31;" />
    <listbar v-focus ref='actionbar' :style="{selected: {bold: true}}" :bottom="1" left="left" :height="1" :items="actions" @keypress="onActionbarKeypress" />
  </box>
</template>

<script>
  import fs from 'fs';
  import request from 'request';
  import FileCookieStore from 'tough-cookie-filestore';
  import cardpdf from '../../cardpdf.js';
  import printer from 'printer';

  export default {
    name: 'issue',
    props: {
      issue: {
        type: Object
      },
      options: {
        type: Object
      }
    },
    data() {
      return {
        picture: null,
        actions: {
          'print': {
            keys: ['p']
          }
        },
      }
    },
    computed: {
      // Produces a list of article titles from the issues object.
      issueDetails() {
        var createDetails = (issue) => {
          return [
            ['key', issue.key],
            ['issue type', issue.fields.issuetype ? issue.fields.issuetype.name : '?'],
            ['reporter', issue.fields.reporter ? issue.fields.reporter.name : '-'],
            ['assignee', issue.fields.assignee ? issue.fields.assignee.name : '-'],
            ['avatar', issue.fields.assignee ? issue.fields.assignee.avatarUrls['48x48'] : ''],
            ['summary', issue.fields.summary],
            ['status', issue.fields.status.name+(issue.fields.status.statusCategory ? ' ('+issue.fields.status.statusCategory.name+')' : '')],
          ];
        }
        return createDetails(this.issue);
      }
    },
    methods: {
      onActionbarKeypress(element, key) {
        if (['right'].includes(key.name)) {
          this.$refs.actionbar.moveRight(1);
        } else if (['left'].includes(key.name)) {
          this.$refs.actionbar.moveLeft(1);
        } else if (['escape', 'esc'].includes(key.name)) {
          this.$parent.issue = null;
          this.$parent.$refs.list.focus();
        } else if (['p'].includes(key.name)) {
            cardpdf.create(this.issue).then((data) => {
              //console.log('printing... data type is: '+typeof(data) + ', is buffer: ' + Buffer.isBuffer(data));
              printer.printDirect({
                data: data,
                type: 'PDF',
                printer: 'zj-58', // printer name, if missing then will print to default printer
                options: {
                  'landscape': false,
                  'fit-to-page': true
                },
                success:function(jobID){
                  console.log("sent to printer with ID: "+jobID);
                },
                error:function(err){
                  console.log(err);
                }
              });
            });
        }
      }
    },
    mounted() {
      if (this.issue.fields.assignee) {
        let that = this;
        let avatarUrl = this.issue.fields.assignee.avatarUrls['48x48'], filename = fs.realpathSync('tmp')+'/avatar.'+this.issue.fields.assignee.name+'.png';
        let file = fs.createWriteStream(filename);
        let jar = request.jar(new FileCookieStore('tmp/cookies.json'));
        request({url: avatarUrl, jar: jar}, (resp) => {
          setTimeout(() => {
            this.picture = filename;
          }, 150);
        }).pipe(file);
      }
    }
  }
</script>
