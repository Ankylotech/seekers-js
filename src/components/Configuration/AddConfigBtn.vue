<template>
    <v-container>
        <v-col>
            <v-btn class="my-14" v-on:click="openAddConfigDialog">
                <v-icon>mdi-plus</v-icon> Add new Configuration
            </v-btn>
        </v-col>
        <v-dialog v-model="dialog">
            <v-card>
                <v-card-title>Add a new Configuration</v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-radio-group v-model="config" required>
                                <v-radio v-for="item in ['co2','temperature']" :key="item" :label="item" :value="item"></v-radio>
                            </v-radio-group>
                        </v-row>
                        <v-row>
                            <v-select :items="devices" :value="devices[0]" v-model="device" label="Choose Device">
                                Device
                            </v-select>
                        </v-row>
                        <v-divider/>
                        <v-row>
                            <v-container v-if="config==='co2'">
                                <v-slider v-model="configData['warn-threshold']" label="warn-threshold" thumb-label min="400" max="3000">
                                </v-slider>
                                <v-slider v-model="configData['error-threshold']" label="error-threshold" thumb-label :min="configData['warn-threshold']+1" max="3000">
                                </v-slider>
                            </v-container>
                            <v-container v-else>
                                <v-range-slider v-model="configData['temp-thresholds']" label="temperature range" thumb-label min="0" max="60">
                                </v-range-slider>
                            </v-container>
                        </v-row>
                        <v-row justify="space-around">
                            <v-spacer/>
                            <v-spacer/>
                            <v-spacer/>
                            <v-btn @click="dialog = false"> Cancel </v-btn>
                            <v-btn @click="sendNewConfig"> Apply </v-btn>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
    import {EventBus} from "../event-bus";

    export default {
        name: 'Add-config-btn',
        props: {
            devices: Array,
            appID: String,
            appName: String,
            token: String
        },
        data: function() {
            return {
                dialog: false,
                config: 'co2',
                configData: {},
                device: ''
            }
        },
        methods: {
            openAddConfigDialog(){
                this.dialog = true;
            },
            async sendNewConfig(){
                this.dialog=false;
                if(this.device !== '' && this.configData !== {}){
                    let json = {};
                    json.config = this.config;
                    json.deviceName = this.device;
                    if(this.config === 'co2'){
                        delete this.configData['temp-thresholds'];
                        json['device-config'] = this.configData;
                    }else{
                        json['device-config'] = {};
                        json['device-config']['upper-warning'] = this.configData['temp-thresholds'][1];
                        json['device-config']['lower-warning'] = this.configData['temp-thresholds'][0];
                    }
                    json.applicationName = this.appName;
                    json.applicationID = this.appID;

                    const myHeaders = new Headers({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.token,
                        'Access-Control-Allow-Origin': '*'
                    });

                    const myRequest = new Request('https://europe-west1-lorawan-qaware-rosenheim.cloudfunctions.net/upload-config', {
                        method: 'POST',
                        withCredentials: true,
                        credentials: 'include',
                        headers: myHeaders,
                        body: JSON.stringify(json)
                    });
                    let error = false;
                    await fetch(myRequest).catch((err) => {
                        console.error(err);
                        error = true;
                    })
                    if(!error){
                        EventBus.$emit('addConfig',json)
                    }
                }else {
                    console.log('incomplete Data')
                }
            }
        }
    }
</script>
