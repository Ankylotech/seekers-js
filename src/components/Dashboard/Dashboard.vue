<template>
    <div ref="scope">
        <h3> {{application}}</h3>
        <div id="panels" v-if="hasLoadedApp && hasLoadedConf">
            <DevicePanel  v-for="device in deviceData" :key="device.name" :raw-data="device" :config="configs"></DevicePanel>
        </div>
        <div v-else>
            <h1>Loading. Please wait.</h1>
        </div>
    </div>
</template>

<script>
    import DevicePanel from "./DevicePanel.vue"
    import {EventBus} from "../event-bus"
    export default {
        name: "Dashboard",
        props: {
            application: String
        },
        components: {
            DevicePanel
        },
        data: function() {
            return {
                hasLoadedApp: false,
                hasLoadedConf: false,
                deviceData: {},
                applicationID: 0,
                configs: {}
            }
        },
        mounted() {
            this.fetchData();
            EventBus.$on('application-change', this.fetchData);
        },
        methods: {
            async fetchData(application = this.application) {
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
                fetch('https://europe-west1-lorawan-qaware-rosenheim.cloudfunctions.net/api/config/' + application).then((response) => {
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
    #panels {
        display:flex;
    }
</style>