// Make sure to import from 'blessed-vue' instead of 'vue'!
import Vue from 'blessed-vue';
import App from './templates/layouts/app.vue';

// Register a global custom directive called `v-focus`
Vue.directive('focus', {
  // When the bound element is inserted into the DOM...
  inserted: function (el) {
    // Focus the element
    el.focus()
  }
});

// Create a new fake root element. (Since blessed has no real DOM)
const el = Vue.dom.createElement();
Vue.dom.append(el);

new Vue({
  render: h => h(App)
})
// Mount to the fake element.
.$mount(el);