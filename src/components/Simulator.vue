<template>
  <div class="container border">
    <div class="d-flex justify-content-center" id="p5Canvas"></div>
  </div>
</template>

<script>
import Player from '../players/player.js'
import {EventBus} from "@/components/event-bus";
import Goal from "../objects/goal.js"
import P5 from "p5";

export default {
  name: "Simulator",
  data: function () {
    return {
      p5: P5,
    }
  },
  mounted() {
    EventBus.$on('getFiles', this.getFiles)
  },
  methods: {
    p5script(p5, files) {
      let player1;
      let player2;
      let goals = [];
      let goalNum = 50;
      // NOTE: Set up is here
      p5.setup = function () {
        let canvas = p5.createCanvas(500, 500);
        canvas.parent("p5Canvas");
        for (let i = 0; i < goalNum; i++) {
          goals.push(new Goal(p5));
        }
        player1 = new Player(files[0], p5, 0, goals);
        player2 = new Player(files[1], p5, 1, goals);
        player1.enemys = player2.seekers;
        player2.enemys = player1.seekers;
      }       // NOTE: Draw is here
      p5.draw = function () {
        p5.background(0);
        goals.forEach((ball) => {
          ball.update();
        })
        player1.draw();
        player2.draw();

      }
    },
    getFiles(files) {
      console.log(files);
      this.p5 = new P5((p5) => {
        this.p5script(p5, files)
      })
    }
  }
}
</script>

<style scoped>

</style>