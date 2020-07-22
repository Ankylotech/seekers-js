<template>
    <div>
        <div v-if="hasLoadedApp && hasLoadedConf">
            <DeviceTimeline v-for="device in devices" :key="device" :application="application" :device="device"></DeviceTimeline>
        </div>
        <div v-else>
            <h4> Loading Data, please Wait</h4>
        </div>
    </div>
</template>

<script>
    import {EventBus} from "../event-bus"
    import DeviceTimeline from "./DeviceTimeline.vue"
    export default {
        name: "Timeline",
        components: {
            DeviceTimeline
        },
        props: {
            application: String
        },
        data: function() {
            return {
                hasLoadedApp: false,
                hasLoadedConf: false,
                devices: [],
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
                fetch('https://europe-west1-lorawan-qaware-rosenheim.cloudfunctions.net/api/applications/' + application + '/devices').then((response) => {
                    response.json().then((applicationData) => {
                        this.hasLoadedApp = true;
                        this.devices = applicationData;
                        console.log(applicationData)
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

</style>