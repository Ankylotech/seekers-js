<template>
    <v-card color="#28537D">
        <v-row justify="space-around">
            <v-toolbar-title class="white--text"> Please login to your Google Account </v-toolbar-title>
        </v-row>
        <v-row justify="space-around">
            <GoogleLogin class="white--text" :params="params" :onSuccess="onSuccess" :onFailure="onFailure">Login</GoogleLogin>
        </v-row>
    </v-card>
</template>
<script>
    import GoogleLogin from 'vue-google-login'

    export default {
        name: 'Login',
        components: {GoogleLogin},
        props: {
            onFailure: {},
            onSuccess: {},
            params: {}
        }
    }
</script>