<template>
    <v-card id="full" class="pa-4" min-width="200">
        <v-card-title>{{name}}</v-card-title>
        <v-divider light/>
        <Datapoint  v-for="(data, index) in deviceData" :key="data.value" :deviceName="name" :value="data" :config="config" :name="index" :hasConfig="hasConfig" />
    </v-card>
</template>

<script>
    import Datapoint from "./Datapoint.vue"
    export default {
        components: {
            Datapoint
        },
        name: "DevicePanel",
        props: {
            rawData: Object,
            config: Object,
            token: String
        },
        data: function() {
            return {
                name: String,
                EUI: String,
                deviceData: Object,
                hasConfig: false
            }
        },
        mounted() {
            this.name = this.rawData.name;
            this.EUI = this.rawData.EUI;
            const sortable = [];
            for (let device in this.rawData.data) {
                sortable.push([device, this.rawData.data[device].toString()]);
            }

            sortable.sort(function(a, b) {
                let i = 0;
                while(a[0].charCodeAt(i) - b[0].charCodeAt(i) === 0){
                    i++
                }
                return a[0].charCodeAt(i) - b[0].charCodeAt(i);
            });
            let data = {};
            sortable.forEach(function(item){
                data[item[0]]=item[1]
            });
            this.deviceData = data;
            if(this.config['device-configs'] !== undefined){
                this.hasConfig = true;
            }
        }

    }
</script>

<style scoped>
    #full {
        grid-column-start: auto;
        grid-column-end:auto;
        grid-row-start: auto;
        grid-row-end: auto;

    }
</style>