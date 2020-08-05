<template>
  <div class="pa-4">
    <div v-if="hasLoadedConf && hasLoadedApp">
      <v-row class="pa-4">
        <v-col md="3" v-for="device in deviceData" :key="device.name">
          <v-spacer/>
          <DevicePanel :token="token" class="pa-4" id="panel" :key="device.name" :raw-data="device"
                       :config="configs"></DevicePanel>
          <v-spacer/>
        </v-col>
      </v-row>
    </div>
    <v-card v-else>
      <h2> Loading Devices. Please Wait. </h2>
      <v-progress-linear indeterminate></v-progress-linear>
    </v-card>
  </div>
</template>

<script>
import DevicePanel from "./DevicePanel.vue"
import {EventBus} from "../event-bus"

export default {
  name: "Dashboard",
  props: {
    application: String,
    ID: String,
    token: String,
  },
  components: {
    DevicePanel
  },
  data: function () {
    return {
      hasLoadedApp: false,
      hasLoadedConf: false,
      deviceData: {},
      applicationID: 0,
      configs: {}
    }
  },
  mounted() {
    this.fetchData();
    EventBus.$on('application-change', this.fetchData);
    EventBus.$on('addConfig', this.addConfig)
  },
  methods: {
    async fetchData(application = this.ID) {
      this.hasLoadedConf = false;
      this.hasLoadedApp = false;
      fetch('https://europe-west1-lorawan-qaware-rosenheim.cloudfunctions.net/api/applications/' + application).then((response) => {
        response.json().then((applicationData) => {
          this.hasLoadedApp = true;
          this.applicationID = applicationData.applicationID;
          let rawData = applicationData.devices
          const sortable = [];
          for (let device in rawData) {
            sortable.push(device);
          }
          sortable.sort();
          let data = {};
          sortable.forEach(function (item) {
            data[item] = rawData[item];
          });
          this.deviceData = data;
        })
      });
      fetch('https://europe-west1-lorawan-qaware-rosenheim.cloudfunctions.net/api/applications/' + application + '/config').then((response) => {
        response.json().then((configData) => {
          this.configs = configData;
          delete this.configs['applicationID'];
          delete this.configs['applicationName'];
          this.hasLoadedConf = true;
        })
      });
    },
    addConfig(json) {
      let name = json.deviceName;
      let conf = json.config;
      if (!this.configs['devices']) this.configs['devices'] = [];
      if (!this.configs['devices'].includes(name)) this.configs['devices'].push(name);
      this.configs['devices'].sort();
      if (!this.configs['device-configs']) this.configs['device-configs'] = {};
      if (!this.configs['device-configs'][name]) this.configs['device-configs'][name] = {};
      this.configs['device-configs'][name][conf] = json['device-configs'];
    }
  }
}
</script>

<style scoped>

</style>