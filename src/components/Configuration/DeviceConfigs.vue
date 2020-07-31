<template>
    <v-container>
        <v-row class="pa-4">
            <v-col md="3" v-for="device in devices" :key="device" >
                <v-card min-width="150">
                    <v-card-title> {{device}} </v-card-title>
                    <v-card-text v-for="(data,index) in deviceConfigs[device]" :key="index">
                        {{index}} : {{data}}
                    </v-card-text>
                </v-card>
            </v-col>

        </v-row>
    </v-container>
</template>

<script>
    export default {
        name: "DeviceConfigs",
        props: {
            config: {},
        },
        data: function() {
            return {
                devices: [],
                deviceConfigs: {}
            }
        },
        mounted() {
            this.devices = this.config.devices;
            this.devices.sort();
            this.deviceConfigs = this.config["device-config"];
            Object.keys(this.deviceConfigs).forEach((key) => {
              const sortable = [];
              for (let conf in this.deviceConfigs[key]) {
                sortable.push([conf, this.deviceConfigs[key][conf]]);
              }

              sortable.sort();
              let data = {};
              sortable.forEach(function(item){
                data[item[0]]=item[1]
              });
              this.deviceConfigs[key] = data;
            })
        },
    }
</script>

