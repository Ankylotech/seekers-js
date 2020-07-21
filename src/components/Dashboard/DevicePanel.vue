<template>
    <div id="full">
        <h3>{{name}}</h3>
        <p v-for="(data, index) in deviceData" :key="data.value"> {{index}} : {{data}}</p>
    </div>
</template>

<script>
    export default {
        name: "DevicePanel",
        props: {
            rawData: Object
        },
        data: function() {
            return {
                name: String,
                EUI: String,
                deviceData: Object
            }
        },
        mounted() {
            this.name = this.rawData.name;
            this.EUI = this.rawData.EUI;
            const sortable = [];
            for (let device in this.rawData.data) {
                sortable.push([device, this.rawData.data[device]]);
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
        }

    }
</script>

<style scoped>
    #full {
        margin-left: 10%;
    }
</style>