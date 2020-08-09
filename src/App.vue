<template>
  <v-app id="app">
    <Selector ></Selector>
    <Simulator ></Simulator>
  </v-app>
</template>

<script>
import Selector from "./components/selectOpponents.vue";
import Simulator from "./components/Simulator.vue";

export default {
  name: "app",
  components: {
    Selector,
    Simulator
  },
  data: function () {
    return {
      hasData: false,
      files: []
    };
  }
};
</script>

