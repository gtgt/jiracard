<!--suppress HtmlUnknownTag, HtmlUnknownAttribute, CheckEmptyScriptTag, CssUnknownProperty -->
<template>
  <!-- Every blessed app needs a root "screen" element.
        smartCSR is scroll-region painting, :keys enables...
        keyboard support.
        autoPadding tells the renderer to take padding and borders
        into account when positioning things.
  -->
  <screen ref='screen' :smartCSR="true" :keys="true" :autoPadding="true">
    <!-- You'll probably notice that width and height need to be specified explicitly here.
          This is because blessed positioning is more like CSS absolute positioning than anything else.
          Also, blessed has no CSS support. Styles compile down into JS objects.
          You'll also notice there's no style inheritance. So background and foreground colors
          need to be specified for every element. :(
    -->
    <box width="100%" :height="3" style="bg: black; fg: #3FA767">
      <listbar ref='menubar' :style="{selected: {bold: true}}" :top="1" left="left" :items="optionItems" :keys="true" />
    </box>
    <box style="bg: black; fg: #3FA767" width="100%" height="92%" top="9%">
      <!-- Render loading text if the feed hasn't loaded yet. -->
      <text v-if="isLoading" style="bg: black; fg: #3FA767; bold: true;" top="center" left="center" content="Loading..." />

      <list ref='list' v-else v-focus
        height="100%" width="100%"
        :border="{}"
        :style="listStyle"
        :keys="true" :mouse="true"
        :items="issueTitles"
        @select="onListSelect"
        @keypress="onListKeypress"
      />
    </box>
    <issue v-if="issue" :issue="issue" :options="options" />
    <login ref='login' v-on:login="onLogin" :hidden="true" />
  </screen>
</template>

<script>
// A request library.


import IssueView from '../views/issue.vue';
import LoginView from '../views/login.vue';
import jira from '../../jira.js';

export default {
  components: {
    Issue: IssueView,
    Login: LoginView
  },
  data() {
    return {
      options: {
        project: null,
        assignee: null,
      },
      authInfo: null,
      issues: null,
      issue: null,
      isLoading: true,
      jira: jira,
      // Note we use JS styles for the list because the object is so large it would
      // be a pain to do in the template.
      listStyle: {
        bg: 'black',
        fg: '#3FA767',

        border: {
          bg: 'black',
          fg: '#3FA767',
        },

        selected: {
          bg: '#444',
          fg: '#F9EC31'
        }
      }
    }
  },

  computed: {
    optionItems() {
      let optionMenu = {}, menuKey;
      for (menuKey in this.options) {
        optionMenu[menuKey] = {
          keys: [],
          callback: () => {

          }
        }
      }
      return optionMenu;
    },
    // Produces a list of article titles from the issues object.
    issueTitles() {
      if(this.issues && this.issues.length) {
        return this.issues.map(item => ("          " + item.key).slice(-10) + ' - ' + item.fields.summary);
      }
    }
  },

  methods: {
    onLogin(username, password) {
      this.authInfo = {user: username, pass: password};
      this.jira.jira.basic_auth = this._data.authInfo;
      this.refresh();
    },
    refresh() {
      this.isLoading = true;
      jira.issues('EDSUP').then((issues) => {
        this.isLoading = false;
        this.issues = issues;
      }).catch((err) => {
        if (!this.authInfo) {
          if (this.$refs.list) {
            this.issue = null;
            this.$refs.list.$parent.hide();
          }
          this.$refs.login.show();
        }
      });
    },
    // Opens the selected list item in a browser.
    onListSelect(element) {
      const i = this.issueTitles.indexOf(element.content);
      const issue = this.issues[i];
      this.issue = issue;
    },
    onListKeypress(element, key) {
      if (['escape', 'esc'].includes(key.name)) {
        this.issue = null;
      } else if (['return'].includes(key.name)) {
        if (this.issue) {

        }
      } else if (['right'].includes(key.name)) {
        this.$refs.menubar.moveRight(1);
        this.$refs.menubar.render();
      } else if (['left'].includes(key.name)) {
        this.$refs.menubar.moveLeft(1);
        this.$refs.menubar.render();
      }
    },
  },

  mounted() {
    // Close the program when CTRL+C is pressed.
    this.$refs.screen.key(['C-c'], () => {
      process.exit(0);
    });
    this.refresh();
  }
}
</script> 
