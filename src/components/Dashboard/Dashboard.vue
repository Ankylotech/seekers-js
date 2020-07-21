<template>
    <div>
        <h1 v-if="hasLoaded">loading. Please Wait</h1>
        <h1 v-else> Loaded!</h1>
    </div>
</template>

<script>
    export default {
        name: "Dashboard",
        data: function() {
            return {
                props: {
                    application: String
                },
                hasLoaded: false,
                deviceData: {},
                applicationID: 0
            }
        },
        mounted() {
            console.log('application:' + this.application)
            this.fetchData();
        },
        methods: {
            fetchData(){
                fetch('https://europe-west1-lorawan-qaware-rosenheim.cloudfunctions.net/api/applications/' + this.application).then((response) => {
                    response.json().then((applicationData) => {
                        this.hasLoaded = true;
                        this.applicationID = applicationData.applicationID;
                        this.deviceData = applicationData.devices;
                        console.log(this.deviceData);
                    })
                });
            }
        }
    }
</script>

<style scoped>

</style>