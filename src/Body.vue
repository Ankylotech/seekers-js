<template>
    <div v-if="hasApplication">

        <v-app-bar app
                   id="parts"
                   class="head"
                   absolute
                   color="#28537D"
                   dark
                   shrink-on-scroll
                   src="./src/assets/qaw-stage-home.png"
                   fade-img-on-scroll>


            <v-btn @click="drawer = true">
                <v-icon>mdi-format-list-bulleted-square</v-icon>
                select Application
            </v-btn>
            <v-spacer/>
            <v-spacer/>
            <v-toolbar-title> {{applicationName}}</v-toolbar-title>
            <v-spacer/>
            <v-spacer/>
            <v-card v-if="!authenticated" class="px-4">
                <GoogleLogin :params="params" :onSuccess="onSuccess" :onFailure="onFailure">Login with QAware Account
                </GoogleLogin>
            </v-card>
            <v-spacer v-else/>

            <template v-slot:img="{ props }">
                <v-img
                        v-bind="props"
                ></v-img>
            </template>


            <template v-slot:extension>
                <v-tabs align-with-title grow>
                    <v-tab v-for="tab in tabs" :key="tab" v-on:click="currentTab = tab">{{tab}}</v-tab>
                    <v-tab v-if="authenticated" key="configuration" v-on:click="currentTab = 'Configuration'">
                        Configuration
                    </v-tab>
                </v-tabs>
            </template>
        </v-app-bar>


        <v-main>
            <keep-alive>
                <Dashboard v-if="currentTabComponent==='Dashboard'" :application="applicationName" :ID="applicationID"/>
                <Configuration v-else-if="currentTabComponent==='Configuration'" :application="applicationName"
                               :ID="applicationID"></Configuration>
                <Timeline v-else :application="applicationName" :ID="applicationID"/>
            </keep-alive>
        </v-main>

    </div>
    <v-card v-else>
        <h2> Loading Application. Please Wait. </h2>
        <v-progress-linear indeterminate></v-progress-linear>
    </v-card>
</template>
<script>
    import Configuration from "./components/Configuration/Config.vue"
    import Dashboard from "./components/Dashboard/Dashboard.vue"
    import GoogleLogin from 'vue-google-login'
    import Timeline from "./components/Timeline/Timeline.vue"

    export default {
        name: 'bODY',
        components: {Configuration, Dashboard, Timeline,GoogleLogin},
        props: {
            Configuration: {},
            Dashboard: {},
            applicationID: {},
            applicationName: {},
            authenticated: {},
            drawer: {},
            hasApplication: {},
            onFailure: {},
            onSuccess: {},
            params: {}
        },
        data: function() {
            return {
                tabs: ['Dashboard', 'Timeline'],
                currentTab: 'Dashboard',
            }
        },
        computed: {
            currentTabComponent() {
                return this.currentTab;
            }
        }
    }
</script>