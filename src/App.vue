<template>
  <v-app id="app" >
    <div v-if="loggedIn">
    <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet">
      <Body  :applicationID="applicationID"
            :applicationName="applicationName" :authenticated="authenticated"
             :drawer="drawer" :hasApplication="hasApplication"
            :onFailure="onFailure" :onSuccess="onSuccess" :params="params"/>
      <Drawer :applications="applications" :drawer="drawer"/>
    </div>
    <div v-else>
      <Login :on-failure="onFailure" :on-success="onSuccess" :params="params"/>
    </div>
  </v-app>
</template>

<script>
  import Drawer from "./Drawer";
  import Body from "./Body";
  import Login from "./Login";
  export default {
    name: "app",
    components: {
      Login,
      Body,
      Drawer
    },
    data: function() {
      return {
        applications: [],
        applicationIDs: [],
        applicationName: String,
        applicationID: String,
        hasApplication : false,
        loggedIn: false,
        authenticated: false,
        params: {
          client_id: "463927479684-s78s8o2bqfh6umt30kn9k4vrvetfuq83.apps.googleusercontent.com"
        },
      };
    },
    mounted() {
      this.fetchApplicationsList()
    },
    methods: {
      drawer() {
        return Drawer.drawer;
      },
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
          console.log(googleUser);
          this.loggedIn = true;
          let mail = googleUser.getBasicProfile().yu;
          const emailSplit = mail.split('@');
          const userEmailDomain = emailSplit[emailSplit.length - 1].toLowerCase();
          let prov = "qaware.de"
          console.log(userEmailDomain);
          this.authenticated = userEmailDomain === prov;
          // This only gets the user information: id, name, imageUrl and email
          console.log(googleUser.getBasicProfile());
        },
      onFailure(){
        console.log("couldn't log in correctly");
        this.loggedIn = true;
        this.authenticated=false;
      }

    },

  };
</script>

