<template>
    <v-container>
        <v-row class="pa-4">
            <v-col md="3" v-for="device in devices" :key="device" >
                <v-card>
                    <v-card-title> {{device}} </v-card-title>
                    <v-card-text v-for="(data,index) in deviceConfigs[device]" :key="index">
                        {{index}} : {{data}}
                    </v-card-text>
                </v-card>
            </v-col>
            <Add-config-btn/>
        </v-row>
    </v-container>
</template>

<script>
    import AddConfigBtn from "./AddConfigBtn";
    export default {
        name: "DeviceConfigs",
        components: {AddConfigBtn},
        props: {
            config: {}
        },
        data: function() {
            return {
                devices: [],
                deviceConfigs: {}
            }
        },
        mounted() {
            this.devices = this.config.devices;
            console.log(this.config["device-config"]);
            this.deviceConfigs = this.config["device-config"];
        },
    }
</script>

