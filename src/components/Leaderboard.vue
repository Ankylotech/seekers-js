<template>
  <v-data-table
    :headers="headers"
    :items="values"
    :sort-by="['points','matches','difference','goals','conceded']"
    :sort-desc="[true,true,true,true,false]"
    class="elevation-1"
    :items-per-page="values.length"
></v-data-table>
</template>

<script>
import {EventBus} from "@/components/event-bus";

export default {
  name: "Leaderboard",
  data: function () {
    return {
      headers: [{
        text: 'Bot',
        align: 'start',
        sortable: false,
        value: 'name',
      },
        {text: 'Punkte', value: 'points'},
        {text: 'Spiele', value: 'matches'},
        {text: 'Gewonnen', value: 'win'},
        {text: 'Unentschieden', value: 'draw'},
        {text: 'Verloren', value: 'lost'},
        {text: 'Tordifferenz', value: 'difference'},
        {text: 'Tore', value: 'goals'},
        {text: 'Gegentore', value: 'conceded'},
      ],
      values: [],
    }
  },
  mounted() {
    EventBus.$on('newLeaderboard',this.getLeaders)
  },
  methods: {
    getLeaders(leaderboard){
      this.values = leaderboard;
    }
  }
}
</script>

<style scoped>

</style>