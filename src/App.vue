<template>
  <div id="app">
    <ApplicationSelect/>
    <PackChart/>
  </div>
</template>

<script>

  import PackChart from "./components/Chart.vue";
  import ApplicationSelect from "./components/ApplicationSelector.vue"

  export default {
    name: "app",
    components: {
      PackChart,
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