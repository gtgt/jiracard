<!--suppress HtmlUnknownTag, HtmlUnknownAttribute, CheckEmptyScriptTag, CssUnknownProperty -->
<template>
  <box top="center" left="center" width="75%" :height="20" :keys="true" :mouse="true"
       :border="{ type: 'line' }" :style="{ border: { fg: 'green' } }"
       :label="' IssueView: '+issue.key+' '"
  >
    <listtable :data="issueDetails" columnWidth="20" width="90%" :top="1" :right="11" :left="1" :height="16" align="left" />
    <picture v-if="picture" :file="picture" :cols="10" :right="1" :width="10" :top="1" :height="10" style='bg: #3FA767; fg: #F9EC31;' />
    <listbar v-focus style='bg: #3FA767; fg: #F9EC31; bold: true;' :bottom="1" left="left" :height="1" :items="actions" />
  </box>
</template>

<script>
  import fs from 'fs';
  import https from 'https';
  import cardImage from '../../cardimage.js';
  import printer from 'printer';

  export default {
    name: 'issue',
    props: {
      issue: {
        type: Object
      },
    },
    data() {
      return {
        picture: null,
        actions: {
          'print': {
            keys: ['p'],
            callback: () => {
              console.log(arguments);
              cardImage.create(this.issue).then((filename) => {
                console.log('print...');
                return;
                printer.printFile({
                  filename: filename,
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
      }
    },
    computed: {
      // Produces a list of article titles from the issues object.
      issueDetails() {
        return [
          ['key', this.issue.key],
          ['summary', this.issue.fields.summary]
        ];
      }
    },
    mounted() {
      if (this.issue.fields.assignee) {
        let avatarUrl = this.issue.fields.assignee.avatarUrls['48x48'], filename = 'picture.jpg';
        let file = fs.createWriteStream(filename);
        let request = https.get(avatarUrl, function(response) {
          response.pipe(file);
          this.picture = filename;
        });
      }
    }
  }
</script>