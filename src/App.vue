<template>
  <v-app id="app" >
    <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet">

    <v-container v-if="loggedIn">
      <v-container v-if="hasApplication" class="overflow-hidden" justify="space-around">

        <v-app-bar app
                   id="parts"
                   class="head"
                   absolute
                   dense
                   color="#28537D"
                   dark
                   shrink-on-scroll
                   scroll-target="#scrolling"
                   src="./src/assets/qaw-stage-home.jpg"
                   fade-img-on-scroll>


          <template v-slot:img="{ props }">
            <v-img
                v-bind="props"
                gradient="to top right, rgba(40,80,125,.3), rgba(90,130,175,.5)"
            ></v-img>
          </template>

          <v-btn @click="drawer = true">
            <v-icon>mdi-format-list-bulleted-square</v-icon>
            select Application
          </v-btn>
          <v-spacer/>
          <v-spacer/>
          <v-toolbar-title> {{applicationName}}</v-toolbar-title>
          <v-spacer/>
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
              <Dashboard :token="token" v-if="currentTabComponent==='Dashboard'" :application="applicationName" :ID="applicationID"/>
              <Configuration v-else-if="currentTabComponent==='Configuration'" :application="applicationName"
                             :ID="applicationID" :token="token"></Configuration>
              <Timeline v-else :token="token" :application="applicationName" :ID="applicationID"/>
            </keep-alive>
        </v-main>

      </v-container>
      <v-card v-else>
        <h2> Loading Application. Please Wait. </h2>
        <v-progress-linear indeterminate></v-progress-linear>
      </v-card>

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
    </v-container>
    <Login v-else :on-failure="onFailure" :on-success="onSuccess" :params="params"></Login>
  </v-app>
</template>

<script >
  import Dashboard from "./components/Dashboard/Dashboard.vue";
  import Timeline from "./components/Timeline/Timeline.vue";
  import Configuration from "./components/Configuration/Config.vue"
  import {EventBus} from "./components/event-bus";
  import Login from "./Login.vue";

  export default {
    name: "app",
    components: {
      Dashboard,
      Timeline,
      Configuration,
      Login
    },
    data: function() {
      return {
        applications: [],
        applicationIDs: [],
        applicationName: String,
        applicationID: String,
        hasApplication : false,
        authenticated: false,
        loggedIn: false,
        drawer: false,
        params: {
          client_id: "463927479684-s78s8o2bqfh6umt30kn9k4vrvetfuq83.apps.googleusercontent.com"
        },
        token: "",
        currentTab: 'Dashboard',
        tabs: ['Dashboard','Timeline','Configuration']
      };
    },
    computed: {
      currentTabComponent() {
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
      onSuccess(googleUser) {
        this.fetchApplicationsList();
        this.loggedIn = true;
        let mail = googleUser.getBasicProfile().getEmail();
        const emailSplit = mail.split('@');
        const userEmailDomain = emailSplit[emailSplit.length - 1].toLowerCase();
        let prov = "qaware.de";
        this.authenticated = userEmailDomain === prov;
        this.token = googleUser.getAuthResponse().id_token;
      },
      onFailure(){
        console.log("couldn't log in correctly");
        this.authenticated=false;
      },
      emitMsg(application) {
        this.applicationName = application;
        this.drawer = false;
        for(let i in this.applications){
          if(this.applications[i] === this.applicationName){
            this.applicationID = this.applicationIDs[i];
          }
        }
        EventBus.$emit('application-change',this.applicationID);
      }

    },

  };
</script>

