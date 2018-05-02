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
    <box style='bg: #3FA767; fg: #F9EC31;' width="100%" height="9%">
      <text
        style='bg: #3FA767; fg: #F9EC31; bold: true;'
        top="center" left="center"
        content="AlligatorIO - Feed Readerish Thing"
      />
    </box>
    <box style='bg: black; fg: #3FA767' width="100%" height="92%" top="9%">
      <!-- Render loading text if the feed hasn't loaded yet. -->
      <text v-if="isLoading"
        style="bg: black; fg: #3FA767; bold: true;"
        top="center" left="center"
        content="Loading..."
      />
      <!-- A list that displays a scrollable and selectable list of text.
            In this case, the feed titles.
            :keys="true" and :mouse="true" enable keyboard and mouse
            navigation in the list.
      -->
      <list v-else
        height="100%" width="100%"
        :border="{}"
        :style="listStyle"
        :keys="true" :mouse="true"
        :items="feedTitles"
        @select="handleListSelect"
      />
    </box>
  </screen>
</template>

<script>
// A request library.
import http from 'http';

export default {
  data() {
    return {
      feed: null,
      isLoading: true,
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
    // Produces a list of article titles from the feed object.
    feedTitles() {
      if(this.feed && this.feed.items && this.feed.items.length) {
        return this.feed.items.map(item => item.title);
      }
    }
  },

  methods: {
    // Opens the selected list item in a browser.
    handleListSelect(event) {
      const feedIndex = this.feedTitles.indexOf(event.content);
      const feedItem = this.feed.items[feedIndex];

      console.log(feedItem.link);
    }
  },

  mounted() {
    // Close the program when CTRL+C is pressed.
    this.$refs.screen.key(['C-c'], () => {
      process.exit(0);
    });

    http.get('example2.json', (res) => {
      const { statusCode } = res;
      const contentType = res.headers['content-type'];

      let error;
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
                          `Status Code: ${statusCode}`);
      } else if (!/^application\/json/.test(contentType)) {
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
          console.log(parsedData);
          this.isLoading = false;
          //this.feed = parser.done();
        } catch (e) {
          console.error(e.message);
        }
      });
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
    });
  }
}
</script> 
