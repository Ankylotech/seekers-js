<template>
    <div class="pa-4">
        <div v-if="hasLoadedConf && hasLoadedApp">
            <v-row class="pa-4">
                <v-col md="3" v-for="device in deviceData" :key="device.name" >
                    <v-spacer/>
                    <DevicePanel :token="token" class="pa-4" id="panel" :key="device.name" :raw-data="device" :config="configs"></DevicePanel>
                    <v-spacer/>
                </v-col>
            </v-row>
        </div>
        <v-card v-else>
            <h2> Loading Devices. Please Wait. </h2>
            <v-progress-linear indeterminate></v-progress-linear>
        </v-card>
    </div>
</template>

<script>
    import DevicePanel from "./DevicePanel.vue"
    import {EventBus} from "../event-bus"
    export default {
        name: "Dashboard",
        props: {
            application: String,
            ID: String,
            token: String
        },
        components: {
            DevicePanel
        },
        data: function() {
            return {
                hasLoadedApp: false,
                hasLoadedConf: false,
                deviceData:{},
                applicationID: 0,
                configs: []
            }
        },
        mounted() {
            this.fetchData();
            EventBus.$on('application-change', this.fetchData);
            EventBus.$on('addConfig',this.addConfig)
        },
        methods: {
            async fetchData(application = this.ID) {
                this.hasLoadedConf = false;
                this.hasLoadedApp = false;
                fetch('https://europe-west1-lorawan-qaware-rosenheim.cloudfunctions.net/api/applications/' + application).then((response) => {
                    response.json().then((applicationData) => {
                        this.hasLoadedApp = true;
                        this.applicationID = applicationData.applicationID;
                        let rawData = applicationData.devices
                        const sortable = [];
                        for (let device in rawData) {
                            sortable.push([device, rawData[device]]);
                        }

                        sortable.sort(function(a, b) {
                            return parseInt(a[0].replace('ERS',''),10) - parseInt(b[0].replace('ERS',''),10);
                        });
                        let data = {};
                        sortable.forEach(function(item){
                            data[item[0]]=item[1]
                        });
                        this.deviceData = data;
                    })
                });
                fetch('https://europe-west1-lorawan-qaware-rosenheim.cloudfunctions.net/api/applications/' + application + '/config').then((response) => {
                    response.json().then((configData) => {
                        this.configs = configData;
                        this.hasLoadedConf = true;
                    })
                });
            },
            addConfig(json){
                for(let i = 0; i < this.configs.length; i++) {
                    if (json.config === this.configs[i].config) {
                        this.configs[i]['device-config'][json.deviceName] = json['device-config'];
                        if(!(this.configs[i]['devices'].includes(json.deviceName))) this.configs[i]['devices'].push(json.deviceName);
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>