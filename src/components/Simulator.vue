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
import Splash from "@/objects/splash";

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
      let goalNum = 7;
      let maxSeekers = 5;
      let player1Score = 0;
      let player2Score = 0;
      let countdown = 10000;
      let gameWon = false;
      let speedUp = 1;
      let splashes = [];

      p5.setup = function () {
        //p5.setFrameRate(8);
        let canvas = p5.createCanvas(1000, 500);
        canvas.parent("p5Canvas");
        for (let i = 0; i < goalNum; i++) {
          goals.push(new Goal(p5));
        }
        player1 = new Player(files[0], p5, 0, goals, maxSeekers);
        player2 = new Player(files[1], p5, 1, goals, maxSeekers);
        player1.enemy = player2;
        player2.enemy = player1;
      }

      p5.draw = function () {
        if (countdown > 0) countdown--;
        else if (player1Score !== player2Score || player1Score === 0) {
          gameWon = true;
        }
        if (!gameWon) {
          p5.background(0);
          for (let i = 0; i < splashes.length; i++) {
            splashes[i].update();
            if (splashes[i].fertig) {
              splashes.shift();
              i--;
            } else {
              break;
            }
          }
          for (let i = 0; i < speedUp; i++) {
            player1.draw();
            player2.draw();


            goals.forEach((goal) => {
              goal.update();
              if (player1.camp.withinBorders(goal.pos)) {
                goal.timer--;
                if (goal.timer === 0) {
                  splashes.push(new Splash(goal.pos, 3, player1.color, 10, 2, 25, p5));
                  goal.reset();
                  player1Score++;
                  player1.score++;
                }
              } else if (player2.camp.withinBorders(goal.pos)) {
                goal.timer--;
                if (goal.timer === 0) {
                  splashes.push(new Splash(goal.pos, 3, player2.color, 10, 2, 25, p5));
                  goal.reset();
                  player2Score++;
                  player2.score++;
                }
              }
            })
            goals.forEach((goal) => {
              goals.forEach((goal2) => {
                goal.collide(goal2);
              })
            })
          }
        } else {
          p5.textAlign(p5.CENTER, p5.CENTER);
          let winner = player1.name;
          p5.stroke(player1.color.red, player1.color.green, player1.color.blue);
          p5.fill(player1.color.red, player1.color.green, player1.color.blue);
          if (player2Score > player1Score) {
            winner = player2.name;
            p5.stroke(player2.color.red, player2.color.green, player2.color.blue);
            p5.fill(player2.color.red, player2.color.green, player2.color.blue);
          }
          p5.strokeWeight(0.1);
          p5.textSize(40);
          let text = winner + ' has won this match!'
          if (player1Score === player2Score) text = 'it is a tie'

          p5.text(text, p5.width / 2, p5.height / 2);

        }
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