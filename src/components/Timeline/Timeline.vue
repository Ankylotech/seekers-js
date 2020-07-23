<template>
    <v-card class="pa-4">
        <div v-if="hasLoadedApp" id="grid" class="pa-4">
            <DeviceTimeline v-for="device in devices" :key="device" :colors="colors" :application="ID" :device="device"></DeviceTimeline>
        </div>
        <div v-else>
            <h4> Loading Devices, please Wait</h4>
        </div>
    </v-card>
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
            application: String,
            ID: String
        },
        data: function() {
            return {
                hasLoadedApp: false,
                devices: [],
                configs: {},
                colors: {co2: "red",temperature: "blue", humidity: "#00ffff", light: "orange", motion: "#556b2f"}
            }
        },
        mounted() {
            this.fetchData();
            EventBus.$on('application-change', this.fetchData);
        },
        methods: {
            async fetchData(application = this.ID) {
                this.hasLoadedApp = false;
                fetch('https://europe-west1-lorawan-qaware-rosenheim.cloudfunctions.net/api/applications/' + application + '/devices').then((response) => {
                    response.json().then((applicationData) => {
                        this.hasLoadedApp = true;
                        const sortable = applicationData;
                        sortable.sort();
                        this.devices = sortable;
                    })
                });
            }
        }
    }
</script>

<style scoped>
    h2 {
        padding-left: 20px;
    }
</style>