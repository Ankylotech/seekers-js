<template>
  <div class="container border">
    <div class="d-flex justify-content-center" id="p5Canvas"></div>
  </div>
</template>

<script>
import Player from '../players/player.js'
import {EventBus} from "@/components/event-bus";
import Ball from "../ball.js"
import P5 from "p5";

export default {
  name: "Simulator",
  data: function(){
    return {
      files: [],
      p5: P5,
    }
  },
  mounted() {
    EventBus.$on('getFiles',this.getFiles)
  },
  methods: {
    p5script(p5,files) {
      let player1;
      let player2;
      let balls = [];
      let ballNum = 5;
      // NOTE: Set up is here
      p5.setup = function () {
        let canvas = p5.createCanvas(500, 500);
        canvas.parent("p5Canvas");
        for(let i = 0; i < ballNum; i++){
          balls.push(new Ball(p5));
        }
        player1 = new Player(files[0],p5,0,balls);
        player2 = new Player(files[1],p5,1,balls);
      }       // NOTE: Draw is here
      p5.draw = function () {
        p5.background(0);
        balls.forEach((ball) => {
          ball.update();
        })
        player1.draw();
        player2.draw();

      }
    },
    getFiles(files){
      console.log(files);
      this.p5 = new P5((p5) => {
        this.p5script(p5,files)
      })
    }
  }
}
</script>

<style scoped>

</style>