<template>
  <v-app id="app" >
    <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet">
    <div v-if="hasApplication">
      <v-app-bar app id="parts" class="head" height="100px">
        <v-select v-model="applicationName"
                    :items="applications"
                    label="Select an Application"
                    @change="emitMsg"/>
        <v-spacer/>
        <v-spacer/>
        <v-toolbar-title> {{applicationName}}</v-toolbar-title>
        <v-spacer/>
        <v-spacer/>
        <template v-slot:extension>
          <v-tabs align-with-title grow>
            <v-tab v-for="tab in tabs" :key="tab" v-on:click="currentTab = tab">{{tab}}</v-tab>
          </v-tabs>
        </template>
      </v-app-bar>
      <v-main>
        <keep-alive>
          <Dashboard v-if="currentTabComponent==='Dashboard'" :application="applicationName" :ID="applicationID"/>
          <Timeline v-else :application="applicationName" :ID="applicationID"/>
        </keep-alive>
      </v-main>
    </div>
    <h1 v-else>
       Loading Applications. Please Wait.
    </h1>
  </v-app>
</template>

<script>

  import Dashboard from "./components/Dashboard/Dashboard.vue"
  import Timeline from "./components/Timeline/Timeline.vue"
  import {EventBus} from "./components/event-bus.js"
  export default {
    name: "app",
    components: {
      Dashboard,
      Timeline
    },
    data: function() {
      return {
        applications: [],
        applicationIDs: [],
        applicationName: String,
        applicationID: String,
        hasApplication : false,
        tabs: ['Dashboard','Timeline'],
        currentTab: 'Dashboard'
      };
    },
    mounted() {
      this.fetchApplicationsList()
    },
    computed: {
      currentTabComponent: function() {
        return this.currentTab;
      }
    },
    methods: {
      fetchApplicationsList() {
        fetch('https://europe-west1-lorawan-qaware-rosenheim.cloudfunctions.net/api/applications/').then((response) => {
          response.json().then((apps) => {
            for(let i = 0;i < apps.length; i++){
              this.applications.push(apps[i][1]);
              this.applicationIDs.push(apps[i][0]);
            }
            this.applicationName = apps[0][1];
            this.applicationID = apps[0][0];
            this.hasApplication = true;
          })
        });
      },
      emitMsg(){
        for(let i = 0;i < this.applications.length; i++){
          if(this.applications[i] === this.applicationName){
            this.applicationID = this.applicationIDs[i];
          }
        }
        EventBus.$emit('application-change',this.applicationID);
      }
    },

  };
</script>

<style scoped>
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
    font-size: 50px;
  }
</style>