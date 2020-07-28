
<template>
    <v-card v-if="hasLoadedConf">
        <AddConfigBtn class="pa-0" :token="token" :devices="allDevices" :app-i-d="ID" :app-name="application"/>
        <v-container  v-for="(data,index) in configs"  :key="index">
            <v-card>
                <h2 class="pa-4"> {{data.config}} Configurations: </h2>
                <Deviceconfigs :config="data" ></Deviceconfigs>
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
    import AddConfigBtn from "./AddConfigBtn.vue"

    export default {

        name: "Config",
        props: {
            application: String,
            ID: String,
            token: String
        },
        components: {
            Deviceconfigs,
            AddConfigBtn
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
            EventBus.$on('addConfig',this.addConfig)
        },
        methods: {
            async fetchData(application = this.ID){
                this.hasLoadedConf = false;
                const myHeaders = new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.token,
                    'Access-Control-Allow-Origin': '*'
                });
                const myRequest = {
                    method: 'GET',
                    withCredentials: true,
                    credentials: 'include',
                    headers: myHeaders
                };
                fetch('https://function-endpoint-5wkxzyv3sa-ew.a.run.app/applications/' + application + '/config',myRequest).then((response) => {
                    response.json().then((configData) => {
                        this.configs = [];
                        for(let key in configData) {
                            if(configData[key] != null) this.configs.push(configData[key]);
                        }
                        this.hasLoadedConf = true;

                    })
                });
                fetch('https://function-endpoint-5wkxzyv3sa-ew.a.run.app/applications/' + application + '/devices',myRequest).then((response) => {
                    response.json().then((configData) => {
                        this.allDevices = configData;

                    })
                });
            },
            addConfig(json){
                for(let i = 0; i < this.configs.length; i++) {
                    if (json.config === this.configs[i].config) {
                        this.configs[i]['device-config'][json.deviceName] = json['device-config'];
                        if(!this.configs[i]['devices'].includes(json.deviceName)) this.configs[i]['devices'].push(json.deviceName);
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>