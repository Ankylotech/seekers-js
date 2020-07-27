
<template>
    <v-card v-if="hasLoadedConf">
        <v-container  v-for="(data,index) in configs"  :key="index">
            <v-card>
                <h2 class="pa-4"> {{data.config}} Configurations: </h2>
                <Deviceconfigs :token="token" :config="data" :all-devices="allDevices" :app-name="application" :app-i-d="ID"></Deviceconfigs>
            </v-card>
        </v-container>
        <v-card v-if="configs.length === 0">
            <v-card-title> There are currently no Configurations available</v-card-title>
        </v-card>
    </v-card>
    <v-card v-else>
        <h2> Loading Configurations. Please Wait. </h2>
        <v-progress-linear indeterminate></v-progress-linear>
    </v-card>
</template>

<script>
    import Deviceconfigs from "./DeviceConfigs.vue"
    import {EventBus} from "../event-bus";

    export default {

        name: "Config",
        props: {
            application: String,
            ID: String,
            token: String
        },
        components: {
            Deviceconfigs
        },
        data: function() {
            return{
                configs:[],
                hasConfig: [],
                hasLoadedConf:false,
                allDevices: [],
            }
        },
        mounted() {
            this.fetchData();
            EventBus.$on('application-change', this.fetchData);
        },
        methods: {
            async fetchData(application = this.ID){
                this.hasLoadedConf = false;
                fetch('https://europe-west1-lorawan-qaware-rosenheim.cloudfunctions.net/api/applications/' + application + '/config').then((response) => {
                    response.json().then((configData) => {
                        this.configs = [];
                        for(let key in configData) {

                            if(configData[key] != null) this.configs.push(configData[key]);
                        }
                        this.hasLoadedConf = true;

                    })
                });
                fetch('https://europe-west1-lorawan-qaware-rosenheim.cloudfunctions.net/api/applications/' + application + '/devices').then((response) => {
                    response.json().then((configData) => {
                        this.allDevices = configData;

                    })
                });
            }
        }
    }
</script>

<style scoped>

</style>