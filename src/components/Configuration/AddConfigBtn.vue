<template>
    <v-container>
        <v-col>
            <v-btn class="my-14" v-on:click="openAddConfigDialog">
                <v-icon>mdi-plus</v-icon>
            </v-btn>
        </v-col>
        <v-dialog v-model="dialog">
            <v-card>
                <v-card-title>Add a new Configuration</v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-radio-group v-model="config" required>
                                <v-radio v-for="item in ['co2','temperature']" :key="item" :label="item" :value="item"></v-radio>
                            </v-radio-group>
                        </v-row>
                        <v-divider/>
                        <v-row>
                            <v-container v-if="config==='co2'">
                                <v-slider v-model="configData['warn-threshold']" label="warn-threshold" thumb-label min="400" max="3000">
                                </v-slider>
                                <v-slider v-model="configData['error-threshold']" label="error-threshold" thumb-label :min="configData['warn-threshold']" max="3000">
                                </v-slider>
                            </v-container>
                            <v-container v-else>
                                <v-range-slider v-model="configData['temp-thresholds']" label="temperature range" thumb-label min="0" max="60">
                                </v-range-slider>
                            </v-container>
                        </v-row>
                        <v-row justify="space-around">
                            <v-spacer/>
                            <v-spacer/>
                            <v-spacer/>
                            <v-btn @click="dialog = false"> Cancel </v-btn>
                            <v-btn @click="dialog = false"> Apply </v-btn>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
    export default {
        name: 'Add-config-btn',
        data: function() {
            return {
                dialog: false,
                config: 'co2',
                configData: {}
            }
        },
        methods: {
            openAddConfigDialog(){
                this.dialog = true;
            }
        }
    }
</script>
