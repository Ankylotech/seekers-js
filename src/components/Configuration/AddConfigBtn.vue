<template>
  <v-container>
    <v-col>
      <v-btn class="my-4" v-on:click="dialog = true">
        <v-icon>mdi-plus</v-icon>
        Add new Configuration
      </v-btn>
    </v-col>
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-container>
          <v-card-title>Add a new Configuration</v-card-title>
          <v-divider/>
          <v-card-text>
            <v-row>
              <v-select :items="devices" :value="devices[0]" v-model="device" label="Choose Device">
                Device
              </v-select>
            </v-row>
            <v-divider/>
            <v-row>
              <v-radio-group v-model="config" v-on:change="configData = {}">
                <v-radio value="co2" label="CO2"> CO2</v-radio>
                <v-radio value="temperature" label="Temperature"> Temperature</v-radio>
              </v-radio-group>
            </v-row>
            <v-divider/>
            <v-row justify="space-around">
              <v-checkbox label="send to IOT Device" v-model="optional[0]"></v-checkbox>
            </v-row>
            <v-container v-if="config === 'co2'">
              <v-slider v-model="configData['low-threshold']" label="lower Threshold" min="400" max="3000"
                        thumb-label></v-slider>
              <v-slider v-model="configData['high-threshold']" thumb-label label="critical Threshold"
                        :min="configData['low-threshold']" max="3000"></v-slider>
            </v-container>
            <v-container v-if="config === 'temperature'">
              <v-slider v-model="configData['cold-threshold']" thumb-label label="too cold Threshold" :min="0"
                        max="30"></v-slider>
              <v-slider v-model="configData['hot-threshold']" thumb-label label="too hot Threshold"
                        :min="configData['cold-threshold']" max="30"></v-slider>
            </v-container>
            <v-text-field label="Device ID" v-if="optional[0]" v-model="configData['sendTo']"></v-text-field>

            <v-row justify="space-around">
              <v-spacer/>
              <v-spacer/>
              <v-spacer/>
              <v-btn @click="dialog = false"> Cancel</v-btn>
              <v-btn @click="sendNewConfig"> Apply</v-btn>
            </v-row>
          </v-card-text>
        </v-container>
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
    token: String,
  },
  data: function () {
    return {
      dialog: false,
      configurables: {},
      config: '',
      configData: {},
      device: '',
      hasLoadedApp: false,
      optional: [false],
      rules: [
        value => !!value || 'Required.',
        value => (value || '').length <= 8 || 'Max 8 characters',
        value => {
          const pattern = /^\d+$/;
          return pattern.test(value) || 'Enter only Numbers'
        },
      ],
    }
  },
  mounted() {
    this.fetchData();
    EventBus.$on('application-change', this.fetchData);
  },
  methods: {
    async sendNewConfig() {
      this.dialog = false;
      if (this.device !== '' && this.configData !== {}) {
        let json = {};
        json.config = this.config;
        json.deviceName = this.device;
        json['device-configs'] = this.configData;
        json.applicationName = this.appName;
        json.applicationID = this.appID;

        const myHeaders = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.token
        });

        const myRequest = new Request('https://europe-west1-lorawan-qaware-rosenheim.cloudfunctions.net/api/applications/' + this.appID + '/config', {
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
        if (!error) {
          EventBus.$emit('addConfig', json)
        }
      } else {
        console.log('incomplete Data')
      }
    },
    fetchData() {
      this.hasLoadedApp = false;
      fetch('https://europe-west1-lorawan-qaware-rosenheim.cloudfunctions.net/api/applications/' + this.appID).then((response) => {
        response.json().then((applicationData) => {
          this.hasLoadedApp = true;
          let rawData = applicationData.devices
          this.configurables = {};
          for (let device in rawData) {
            this.configurables[device] = [];
            Object.keys(rawData[device]['data']).forEach(key => {
              this.configurables[device].push(key);
            })
          }
        })
      });
    }

  }
}
</script>
