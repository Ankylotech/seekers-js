
<template>
    <div v-if="hasLoadedConf">
        <AddConfigBtn class="pa-0" :token="token" :devices="allDevices" :app-i-d="ID" :app-name="application"  />

        <v-row justify="space-around">
          <v-col  v-for="(index) in configs['devices']" :key="index">
            <Deviceconfigs  :config="configs['device-configs'][index]" :name="index" ></Deviceconfigs>
          </v-col>
        </v-row>
        <v-card v-if="!hasConf">
            <v-card-title> There are currently no Configurations available</v-card-title>
        </v-card>
    </div>
    <v-card v-else>
        <h2> Loading Configurations. Please Wait. </h2>
        <v-progress-linear indeterminate></v-progress-linear>
    </v-card>
</template>

<script>
    import Deviceconfigs from "./DeviceConfigs.vue"
    import {EventBus} from "../event-bus";
    import AddConfigBtn from "./AddConfigBtn.vue"

    export default {

        name: "Config",
        props: {
            application: String,
            ID: String,
            token: String
        },
        components: {
            Deviceconfigs,
            AddConfigBtn
        },
        data: function() {
            return{
                configs:{},
                hasConfig: [],
                hasLoadedConf:false,
                allDevices: [],
                hasConf: false,
            }
        },
        mounted() {
            this.fetchData();
            EventBus.$on('application-change', this.fetchData);
            EventBus.$on('addConfig',this.addConfig)
        },
        methods: {
            async fetchData(application = this.ID){
                this.hasLoadedConf = false;
                fetch('https://europe-west1-lorawan-qaware-rosenheim.cloudfunctions.net/api/applications/' + application + '/config').then((response) => {
                    response.json().then((configData) => {
                        this.configs = configData;
                        delete this.configs['applicationID'];
                        delete this.configs['applicationName'];
                        if(this.configs['devices']) {
                          this.hasConf = true;
                          this.configs['devices'].sort();
                          let rawData = configData['device-configs']
                          const sortable = [];
                          for (let device in rawData) {
                            sortable.push(device);
                          }
                          sortable.sort();
                          let data = {};
                          sortable.forEach(function (item) {
                            let rawData2 = rawData[item];
                            const sortable2 = [];
                            for (let device in rawData2) {
                              sortable2.push(device);
                            }
                            sortable2.sort();
                            let data2 = {};
                            sortable2.forEach(function (item2) {
                              data2[item2] = rawData2[item2]
                            });
                            data[item] = data2
                          });
                          this.configs['device-configs'] = data;
                        }
                        this.hasLoadedConf = true;

                    })
                });
                fetch('https://europe-west1-lorawan-qaware-rosenheim.cloudfunctions.net/api/applications/' + application + '/devices').then((response) => {
                    response.json().then((devices) => {
                        this.allDevices = devices;
                        this.allDevices.sort();
                    })
                });
            },
            addConfig(json){
              let name = json.deviceName;
              let conf = json.config;
              if(!this.configs['devices'] !== undefined) this.configs['devices'] = [];
              if(!this.configs['devices'].includes(name)) this.configs['devices'].push(name);
              this.configs['devices'].sort();
              if(!this.configs['device-configs']) this.configs['device-configs'] = {};
              if(!this.configs['device-configs'][name]) this.configs['device-configs'][name] = {};
              this.configs['device-configs'][name][conf] = json['device-configs'];
            }
        }
    }
</script>

<style scoped>

</style>