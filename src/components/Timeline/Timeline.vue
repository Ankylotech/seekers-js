<template>
    <div>
        <div v-if="hasLoadedApp">
            <DeviceTimeline v-for="device in devices" :key="device" :colors="colors" :application="application" :device="device"></DeviceTimeline>
        </div>
        <div v-else>
            <h4> Loading Devices, please Wait</h4>
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
                devices: [],
                configs: {},
                colors: {co2: "grey",temperature: "orange", humidity: "light-blue", light: "yellow", motion: "red"}
            }
        },
        mounted() {
            this.fetchData();
            EventBus.$on('application-change', this.fetchData);
        },
        methods: {
            async fetchData(application = this.application) {
                this.hasLoadedApp = false;
                fetch('https://europe-west1-lorawan-qaware-rosenheim.cloudfunctions.net/api/applications/' + application + '/devices').then((response) => {
                    response.json().then((applicationData) => {
                        this.hasLoadedApp = true;
                        this.devices = applicationData;
                    })
                });
            }
        }
    }
</script>

<style scoped>

</style>