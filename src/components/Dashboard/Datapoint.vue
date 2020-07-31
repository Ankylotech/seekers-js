<template>
    <div>
        <v-card-text class="red--text" color="red" v-if="isRed">{{name.toUpperCase()}} : {{value}} </v-card-text>
        <v-card-text class="orange--text" color="orange" v-else-if="isOrange">{{name.toUpperCase()}} : {{value}}</v-card-text>
        <v-card-text v-else>{{name}} : {{value}}</v-card-text>
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
                    let index;
                    for(let i = 0; i < this.config.length; i++){
                        if(this.config[i].config === "co2"){
                            index = i;
                        }
                    }
                    if(this.config[index] != null &&this.config[index]["device-config"][this.deviceName]) {
                        if (parseInt(this.value) > this.config[index]["device-config"][this.deviceName]["error-threshold"]) this.isRed = true;
                        else if (parseInt(this.value) > this.config[index]["device-config"][this.deviceName]["warn-threshold"]) this.isOrange = true;
                    }else {
                        if (parseInt(this.value) > 2000) this.isRed = true;
                        else if (parseInt(this.value) > 1400) this.isOrange = true;
                    }
                }else if(this.name === 'temperature'){
                    let index;
                    for(let i = 0; i < this.config.length; i++){
                        if(this.config[i].config === "temperature"){
                            index = i;
                        }
                    }
                    if(this.config[index] != null && this.config[index]["device-config"][this.deviceName]) {
                        if (parseFloat(this.value) < this.config[index]["device-config"][this.deviceName]["lower-warning"]) this.isRed = true;
                        else if (parseFloat(this.value) > this.config[index]["device-config"][this.deviceName]["upper-warning"]) this.isRed = true;
                    }else {
                        if (parseFloat(this.value) < 0) this.isRed = true;
                        else if (parseFloat(this.value) > 30) this.isRed = true;

                    }
                }
            }
        }
    }
</script>
