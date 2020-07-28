<template>
    <v-card color="#28537D">
        <v-row justify="space-around">
            <v-card-title class="white--text"> Please login to your Google Account </v-card-title>
        </v-row>
        <v-divider/>
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
            onFailure: Function,
            onSuccess: Function,
            params: {}
        }
    }
</script>