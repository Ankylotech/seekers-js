<template>
  <div id="app">
    <ApplicationSelect/>
  </div>
</template>

<script>

  import ApplicationSelect from "./components/Applications.vue"

  export default {
    name: "app",
    components: {
      ApplicationSelect
    },
    data: function() {
      return {

      };
    },

  };
</script>

<style>
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>