<template>
  <div id="app">
    <p v-if="hasApplication">
      <label for="applications">Choose an Application:  </label>
      <select name="applications" id="applications" v-model="applicationName">
        <option v-for="apps in applications" :key="apps" :value="apps">
          {{apps}}
        </option>
      </select>

      <DataPresenter :application="applicationName" />
    </p>
    <p v-else>
       Loading Data. Please Wait.
    </p>
  </div>
</template>

<script>

  import DataPresenter from "./components/Applications.vue"

  export default {
    name: "app",
    components: {
      DataPresenter
    },
    data: function() {
      return {
        applications: [],
        applicationName: String,
        hasApplication : false
      };
    },
    mounted() {
      this.fetchApplicationsList()
    },
    methods: {
      fetchApplicationsList() {
        fetch('https://europe-west1-lorawan-qaware-rosenheim.cloudfunctions.net/api/applications/').then((response) => {
          response.json().then((apps) => {
            this.applications = apps;
            this.applicationName = apps[0];
            this.hasApplication = true;
          })
        });
      }
    },

  };
</script>

<style>
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>