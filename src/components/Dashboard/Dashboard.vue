<template>
    <v-card class="pa-4">
        <v-container v-if="hasLoadedConf && hasLoadedApp">
            <v-row class="pa-4">
                <v-col md="3" v-for="device in deviceData" :key="device.name" >
                    <v-spacer/>
                    <DevicePanel class="pa-4" id="panel" :key="device.name" :raw-data="device" :config="configs"></DevicePanel>
                    <v-spacer/>
                </v-col>
            </v-row>
        </v-container>
        <h2 v-else>Loading Devices. Please Wait.</h2>
    </v-card>
</template>

<script>
    import DevicePanel from "./DevicePanel.vue"
    import {EventBus} from "../event-bus"
    export default {
        name: "Dashboard",
        props: {
            application: String ,
            ID: String
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
            randomString(row){
                console.log(row);
                return Math.random().toString(36).substring(7);
            }
        }
    }
</script>

<style scoped>

</style>