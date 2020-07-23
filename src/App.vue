<template>
  <div id="app">
    <div v-if="hasApplication">
      <div id="parts">
        <br>
        <label for="applications">Choose an Application: <br> </label>
        <select name="applications" id="applications" v-model="applicationName" @change="emitMsg">
          <option v-for="apps in applications" :key="apps" :value="apps">
            {{apps}}
          </option>
        </select>
        <br>
        <br>
      </div>
      <div>
        <DataPresenter :application="applicationName" />
      </div>
    </div>
    <h1 v-else>
       Loading Applications. Please Wait.
    </h1>
  </div>
</template>

<script>

  import DataPresenter from "./components/Applications.vue"
  import {EventBus} from "./components/event-bus.js"

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
      },
      emitMsg(){
        EventBus.$emit('application-change',this.applicationName);

      }
    },

  };
</script>

<style>
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
    padding-left: 20px;
    padding-right: 20px;
  }
  label {
    font-size: 30px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
    padding-left: 20px;
  }
  select {
    font-size: 20px;
    padding-left: 20px;
  }
  #parts {
    border: 2px solid black;
    margin-top: 40px;
  }
</style>