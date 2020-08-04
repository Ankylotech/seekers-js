<template>
  <v-container fluid>
    <v-data-iterator
        :items="deviceList"
        hide-default-footer
    >
      <template v-slot:default="props">
        <v-row>
          <v-col
              v-for="item in props.items"
              :key="item.name"
              cols="12"
              sm="6"
              md="4"
              lg="3"
          >
            <v-card min-width="270">
              <v-card-title class="subheading font-weight-bold">{{ item.name }}</v-card-title>

              <v-container v-for="(key,index) in item" :key="index" >
                <div v-if="key !== item.name">
                  <v-divider></v-divider>
                  <v-card-title  class="subheading"> {{index.charAt(0).toUpperCase() + index.slice(1)}}</v-card-title>
                  <v-divider></v-divider>
                  <v-list dense>
                    <v-list-item
                        v-for="(key2, index2) in item[index]"
                        :key="index2"
                    >
                      <v-list-item-content >{{ index2 }}:</v-list-item-content>
                      <v-list-item-content class="align-end">{{ key2 }}</v-list-item-content>
                    </v-list-item>
                  </v-list>
                </div>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
    export default {
        name: "DeviceConfigs",
        props: {
            configs: {},
            name: String
        },
        data: function() {
            return {
              deviceList: [],
            }
        },
        mounted() {
          this.configs['devices'].forEach((device) => {
            this.configs['device-configs'][device]['name'] = device;
            this.deviceList.push(this.configs['device-configs'][device]);
          })
        },
    }
</script>

