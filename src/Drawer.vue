<template>
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
</template>
<script>
    import {EventBus} from "./components/event-bus";

    export default {
        name: 'Drawer',
        props: {
            applications: {},
            drawer: {}
        },
        methods: {
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
        }
    }
</script>
