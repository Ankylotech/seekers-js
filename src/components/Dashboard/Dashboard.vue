<template>
    <div >
        <div id="panels" v-if="hasLoaded">
            <DevicePanel v-for="device in deviceData" :key="device.name" :raw-data="device"></DevicePanel>
        </div>
        <div v-else>
            <h1>Loading. Please wait.</h1>
        </div>
    </div>
</template>

<script>
    import DevicePanel from "./DevicePanel.vue"
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
                hasLoaded: false,
                deviceData: {},
                applicationID: 0
            }
        },
        mounted() {
            this.fetchData();

        },
        methods: {
            async fetchData() {
                fetch('https://europe-west1-lorawan-qaware-rosenheim.cloudfunctions.net/api/applications/' + this.application).then((response) => {
                    response.json().then((applicationData) => {
                        this.hasLoaded = true;
                        this.applicationID = applicationData[0].applicationID;
                        let rawData = applicationData[0].devices
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
            }
        }
    }
</script>

<style scoped>
    #panels {
        display:flex;
    }
</style>