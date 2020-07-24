
<template>
    <v-card v-if="hasLoadedConf">

    </v-card>
    <v-card v-else>
        <h2> Loading Configurations. Please Wait. </h2>
        <v-progress-linear indeterminate></v-progress-linear>
    </v-card>
</template>

<script>
    export default {
        name: "Config",
        props: {
            application: String,
            ID: String
        },
        data: function() {
            return{
                configs:[],
                hasLoadedConf:Boolean
            }
        },
        methods: {
            async fetchData(application = this.ID){
                fetch('https://europe-west1-lorawan-qaware-rosenheim.cloudfunctions.net/api/applications/' + application + '/config').then((response) => {
                    response.json().then((configData) => {
                        this.configs = configData;
                        this.hasLoadedConf = true;
                    })
                });
            }
        }
    }
</script>

<style scoped>

</style>