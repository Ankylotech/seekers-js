<template>
  <div>
    <v-app-bar app
               id="parts"
               class="head"
               absolute
               dense
               color="#28537D"
               dark
               shrink-on-scroll
               scroll-target="#scrolling"
               src="https://www.qaware.de/fileadmin/user_upload/Stagemoods/qaw-stage-home.png"
               fade-img-on-scroll>
      <v-row justify="space-around">
        <v-spacer/>
        <v-spacer/>
        <v-spacer/>
        <v-spacer/>
        <v-spacer/>
        <v-spacer/>
        <v-card-title class="white--text"> Please login to your QAware Google Account</v-card-title>
        <v-spacer/>
        <v-spacer/>
        <v-spacer/>
        <v-spacer/>
        <v-spacer/>
        <v-card color="black" max-height="40">
          <GoogleLogin class="white--text px-4" color="black" :params="params" :onSuccess="onSuccess"
                       :onFailure="onFailure">Login
          </GoogleLogin>
        </v-card>

      </v-row>

    </v-app-bar>
    <v-main>
      <v-layout align-center justify-center>

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