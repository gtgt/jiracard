<!--suppress HtmlUnknownTag, HtmlUnknownAttribute, CheckEmptyScriptTag, CssUnknownProperty -->
<template>
  <box top="center" left="center" width="75%" :height="20" :keys="true" :mouse="true"
       :border="{ type: 'line' }" :style="{ border: { fg: 'green' } }"
       :label="' IssueView: '+issue.key+' '"
  >
    <listtable :data="issueDetails" columnWidth="20" width="90%" :top="1" :left="1" :height="16" align="left" />
  </box>
</template>

<script>
  export default {
    name: 'issue',
    props: {
      issue: {
        type: Object
      },
    },
    data() {
      return {}
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

    }
  }
</script>