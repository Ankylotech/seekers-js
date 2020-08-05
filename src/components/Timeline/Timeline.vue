<template>
  <div class="pa-4">
    <div v-if="hasLoadedApp" id="grid" class="pa-4">
      <DeviceTimeline class="pa-2" v-for="device in devices" :token="token" :key="device" :colors="colors"
                      :application="ID" :device="device"></DeviceTimeline>
    </div>
    <v-card v-else>
      <h2> Loading Device Data. Please Wait. </h2>
      <v-progress-linear indeterminate></v-progress-linear>
    </v-card>
  </div>
</template>

<script>
import {EventBus} from "../event-bus"
import DeviceTimeline from "./DeviceTimeline.vue"

export default {
  name: "Timeline",
  components: {
    DeviceTimeline
  },
  props: {
    application: String,
    ID: String,
    token: String
  },
  data: function () {
    return {
      hasLoadedApp: false,
      devices: [],
      configs: {},
      colors: {co2: "red", temperature: "blue", humidity: "#00ffff", light: "orange", motion: "#556b2f"}
    }
  },
  mounted() {
    this.fetchData();
    EventBus.$on('application-change', this.fetchData);
  },
  methods: {
    async fetchData(application = this.ID) {

      this.hasLoadedApp = false;
      fetch('https://europe-west1-lorawan-qaware-rosenheim.cloudfunctions.net/api/applications/' + application + '/devices').then((response) => {
        response.json().then((applicationData) => {
          this.hasLoadedApp = true;
          const sortable = applicationData;
          sortable.sort();
          this.devices = sortable;
        })
      });
    }
  }
}
</script>

<style scoped>

</style>