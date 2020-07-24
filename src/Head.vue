<template>

</template>
<script>
    import GoogleLogin from 'vue-google-login'

    export default {
        name: 'Head',
        components: {GoogleLogin},
        props: {
            applicationName: String,
            authenticated: Boolean,
            drawer: Boolean,
            params: {},
            onFailure: Function,
            onSuccess: Function

        },
        data: function() {
            return {

            }
        },

    }
</script>