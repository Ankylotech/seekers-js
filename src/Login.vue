<template>
  <div>
  <v-app-bar app
             id="parts"
             class="head"
             absolute
             dense
             color="#28537D"
             dark
             src="https://www.qaware.de/fileadmin/user_upload/Stagemoods/qaw-stage-home.png">
        <v-row justify="space-around">
            <v-card-title class="white--text"> Please login to your QAware Google Account </v-card-title>
        </v-row>

  </v-app-bar>
  <v-main >
    <v-layout align-center justify-center>
    <v-card color="black">
      <GoogleLogin class="white--text px-4" color="black" :params="params" :onSuccess="onSuccess" :onFailure="onFailure">Login</GoogleLogin>
    </v-card>
    </v-layout>
  </v-main>
  </div>
</template>
<script>
    import GoogleLogin from 'vue-google-login'

    export default {
        name: 'Login',
        components: {GoogleLogin},
        props: {
            onFailure: Function,
            onSuccess: Function,
            params: {}
        }
    }
</script>