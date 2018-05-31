<!--suppress ALL -->
<template>
  <form top="center" left="center" width="200" :height="15" :keys="true" :mouse="true" :border="{ type: 'line' }" :style="{ border: { fg: 'green' } }">
    <box :width="50" :height="1" :top="1" left="center" align="center" content="Login Form" style="bg: black; fg: white; bold: true" />
    <text :top="3" left="50%-20" style="bold: true">Username: </text>
    <textbox :keys="true" :mouse="true" ref='username'
            :top="3" left="50%-8" :length="10" :width="30" :height="1"
            v-bind:value="username" @submit="submit" :inputOnFocus="true"
            style="bg: black; fg: white; underline: white;"/>
    <text :top="5" left="50%-20" style="bold: true">Password: </text>
    <textbox :keys="true" :mouse="true" ref='password'
            :top="5" left="50%-8" :length="10" :width="30" :height="1"
            v-bind::value="password" @submit="submit" :inputOnFocus="true"
            style="bg: black; fg: white; underline: white;" :censor="true"/>
    <button :keys="true" :mouse="true" content="Login"
            :width="20" :height="3" :top="9" left="center"
            align="center" valign="middle"
            :style="[buttonStyle, submitting && loggingStyle]"
            @press="submit"/>
  </form>
</template>

<script>
export default {
  name: 'login',
  props: {
    username: {
      type: String
    },
    password: {
      type: String
    },
    login: {
      type: Function
    }
  },
  data() {
    return {
      submitting: false
    }
  },
  computed: {
    buttonStyle () {
      return {
        bg: 'blue',
        fg: 'white'
      }
    },
    loggingStyle () {
      return {
        bg: 'grey'
      }
    }
  },
  methods: {
    submit() {
      this.$el.hide();
      this.submitting = true;
      if (this._props.login) {
        this._props.login(this.$refs.username.value, this.$refs.password.value);
      }
    },
    show() {
      this.$el.show();
      this.$refs.username.focus();
    },
    hide() {
      this.$el.hide();
    }
  },
  mounted () {
    this.submitting = false;
  }
}
</script>