<template>
  <v-container>
    <v-file-input chips accept="application/x-javascript" multiple label="Load your Bots"
                  v-model="files"></v-file-input>
  </v-container>
</template>

<script>
import {EventBus} from './event-bus.js';

export default {
  name: "selectOpponents",
  props: {
    hasData: Boolean
  },
  data: function () {
    return {
      files: []
    }
  },
  updated: function () {
    this.file();
  },
  methods: {
    file() {
      if (this.files.length >= 2) {
        EventBus.$emit('getFiles', this.files)
      }
    }
  }
}
</script>

<style scoped>

</style>