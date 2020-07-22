<template>
    <div id="full">
        <h3>{{name}}</h3>
        <Datapoint v-for="(data, index) in deviceData" :key="data.value" :deviceName="name" :value="data" :config="config" :name="index" :hasConfig="hasConfig" />
    </div>
</template>

<script>
    import Datapoint from "./Line.vue"
    export default {
        components: {
            Datapoint
        },
        name: "DevicePanel",
        props: {
            rawData: Object,
            config: Array
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
            if(this.config !== undefined ){
                this.hasConfig = true;
            }else {
                console.log("he does not config")
            }
        }

    }
</script>

<style scoped>
    #full {
        margin-left: 10%;
    }
</style>