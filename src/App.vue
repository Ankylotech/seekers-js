<template>
  <v-app id="app" >
    <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet">
    <div v-if="hasApplication">

      <v-app-bar app
                 id="parts"
                 class="head"
                 absolute
                 color="#28537D"
                 dark
                 shrink-on-scroll
                 src="/src/assets/qaw-stage-home.png"
                  fade-img-on-scroll>

        <v-card color="#28537D">
          <slot>
          <v-btn @click="drawer = true"><v-icon>mdi-format-list-bulleted-square</v-icon> select Application </v-btn>
          </slot>
        </v-card>
        <v-row>

        </v-row>
        <v-spacer/>
        <v-toolbar-title> {{applicationName}}</v-toolbar-title>
        <v-spacer/>
        <v-spacer/><v-spacer/>

        <template v-slot:img="{ props }">
          <v-img
                  v-bind="props"
          ></v-img>
        </template>



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

    <v-navigation-drawer
            v-model="drawer"
            color="#28537D"
            absolute
            dark
            temporary
    >
      <v-list
              dense
              nav
              class="py-0"
      >
        <v-list-item class="px-0">
          <v-list-item-content>
            <v-list-item-title>Select Application</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>
        <v-list-item-group
                active-class="white--text text--accent-4">
          <v-list-item v-for="application in applications" :key="application">
            <v-list-item-content @click="emitMsg(application)">
              <v-list-item-title>{{ application }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

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
        currentTab: 'Dashboard',
        drawer: false
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
      emitMsg(application){
        this.applicationName = application;
        this.drawer = false;
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

</style>