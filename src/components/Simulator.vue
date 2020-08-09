<template>
  <div class="container border">
    <div class="d-flex justify-content-center" id="p5Canvas"></div>
  </div>
</template>

<script>
import Player from '../players/player.js'
import {EventBus} from "@/components/event-bus";

export default {
  name: "Simulator",
  data: function(){
    return {
      files: [],
    }
  },
  mounted() {
    EventBus.$on('getFiles',this.getFiles)
  },
  methods: {
    p5script(p5) {
      let posX = 0;
      let speed = 1;
      let player1;
      let player2;
      // NOTE: Set up is here
      p5.setup = function () {
        console.log("setup")
        player1 = new Player(this.files[0]);
        player2 = new Player(this.files[1]);
        let canvas = p5.createCanvas(500, 500)
        canvas.parent("p5Canvas");
        p5.ellipse(p5.width / 2, p5.height / 2, 500, 500);
      }       // NOTE: Draw is here
      p5.draw = function () {
        console.log("draw")
        player1.draw();
        player2.draw();
        p5.background(0);
        const degree = p5.frameCount * 3;
        const y = p5.sin(p5.radians(degree)) * 50;

        p5.push();
        p5.translate(0, p5.height / 2);
        p5.ellipse(posX, y, 50, 50);
        p5.pop();
        posX += speed;

        if (posX > p5.width || posX < 0) {
          speed *= -1;
        }
      }
    },
    getFiles(files){
      console.log(files);
      this.files = files;
      const P5 = require('p5');
      new P5(this.p5script)
    }
  }
}
</script>

<style scoped>

</style>