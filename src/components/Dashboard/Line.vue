<template>
    <div>
        <p style="color: red" v-if="isRed">{{name}} : {{value}} </p>
        <p style="color: orange" v-else-if="isOrange">{{name}} : {{value}}</p>
        <p v-else>{{name}} : {{value}}</p>
    </div>
</template>

<script>
    export default {
        name: "Datapoint",
        props: {
            name: String,
            value: String,
            config: Array,
            hasConfig: Boolean,
            deviceName: String
        },
        data: function() {
            return {
                isRed: false,
                isOrange: false
            }
        },
        mounted() {
            if(this.hasConfig){
                if(this.name === 'co2'){
                    if(this.config[0] != null &&this.config[0]["device-config"][this.deviceName]) {
                        if (parseInt(this.value) > this.config[0]["device-config"][this.deviceName]["error-threshold"]) this.isRed = true;
                        else if (parseInt(this.value) > this.config[0]["device-config"][this.deviceName]["warn-threshold"]) this.isOrange = true;
                    }else {
                        if (parseInt(this.value) > 2000) this.isRed = true;
                        else if (parseInt(this.value) > 1400) this.isOrange = true;
                    }
                }else if(this.name === 'temperature'){
                    if(this.config[1] != null && this.config[1]["device-config"][this.deviceName]) {
                        if (parseInt(this.value) < this.config[1]["device-config"][this.deviceName]["lower-warning"]) this.isRed = true;
                        else if (parseInt(this.value) > this.config[1]["device-config"][this.deviceName]["upper-warning"]) this.isRed = true;
                    }else {
                        if (parseInt(this.value) < 0) this.isRed = true;
                        else if (parseInt(this.value) > 30) this.isRed = true;

                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>