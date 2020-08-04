<template>
    <v-card min-width="250" min-height="550" max-height="550" max-width="250">
        <v-card-title> {{name}} </v-card-title>
        <v-card-text v-for="(data,config) in config" :key="config">
          <v-divider/>
          <v-card-subtitle class="text-subtitle-1 text--black font-weight-bold"> {{ config.toUpperCase() }} </v-card-subtitle>
          <v-divider/>
          <v-card-text v-for="(value,key) in data" :key="key">
            {{key}} : {{value}}
          </v-card-text>
        </v-card-text>
    </v-card>
</template>

<script>
    export default {
        name: "DeviceConfigs",
        props: {
            config: {},
            name: String
        },
        data: function() {
            return {

            }
        },
        mounted() {

        },
    }
</script>

