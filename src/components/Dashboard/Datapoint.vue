<template>
    <div>
        <v-card-subtitle class="red--text" color="red" v-if="isRed">{{name.toUpperCase()}} : {{value}} </v-card-subtitle>
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
            config: Object,
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
                if(this.config.devices.includes(this.deviceName)){
                  let configs = this.config['device-configs'][this.deviceName];
                  if(configs[this.name]){
                    if(this.name === 'co2'){
                      if(configs.co2['high-threshold'] <= parseInt(this.value)) this.isRed = true;
                      else if(configs.co2['low-threshold'] <= parseInt(this.value)) this.isOrange = true;
                    }else if(this.name === 'temperature'){
                      if(configs.temperature['hot-threshold'] <= parseInt(this.value)) this.isRed = true;
                      else if(configs.temperature['cold-threshold'] >= parseInt(this.value)) this.isRed = true;
                    }
                  }else {
                    if(this.name === 'co2'){
                      if(2000 <= parseInt(this.value)) this.isRed = true;
                      else if(1400 <= parseInt(this.value)) this.isOrange = true;
                    }else if(this.name === 'temperature'){
                      if(30 <= parseInt(this.value)) this.isRed = true;
                      else if(0 >= parseInt(this.value)) this.isRed = true;
                    }
                  }
                }
            }
        }
    }
</script>
