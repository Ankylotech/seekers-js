<template>
  <div class="container border">
    <div class="d-flex justify-content-center" id="p5Canvas"></div>
    <v-divider></v-divider>
    <Leaderboard></Leaderboard>
  </div>
</template>

<script>
import Player from '../players/player.js'
import {EventBus} from "@/components/event-bus";
import Goal from "../objects/goal.js"
import P5 from "p5";
import Splash from "@/objects/splash";
import Leaderboard from "@/components/Leaderboard";

export default {
  name: "Simulator",
  components: {Leaderboard},
  data: function () {
    return {
      p5: P5,
    }
  },
  mounted() {
    EventBus.$on('getFiles', this.getFiles)
  },
  methods: {
    p5script(p5, files, EventBus) {

      let matching = [];
      let players = [];
      let goals = [];
      let goalNum = 7;
      let maxSeekers = 5;
      let scores = [];
      let countdown = 10000;
      let initialCountdown = countdown;
      let gameWon = false;
      let speedUp = 1000;
      let splashes = [];
      let leaderboard = [];

      p5.setup = function () {
        p5.setFrameRate(60);
        let canvas = p5.createCanvas(1000, 500);
        canvas.parent("p5Canvas");
        for (let i = 0; i < goalNum; i++) {
          goals.push(new Goal(p5));
        }
        for (let i = 0; i < files.length; i++) {
          players.push(new Player(files[i], p5, 0, goals, maxSeekers));
          leaderboard.push({
            name: files[i].name.substring(0, files[i].name.length - 3),
            points: 0,
            win: 0,
            draw: 0,
            lost: 0,
            matches: 0,
            goals: 0,
            conceded: 0,
            difference: 0,
          })
        }
        EventBus.$emit('newLeaderboard', leaderboard);
        matching.push(players[0]);
        matching.push(players[1]);
        scores.push(0);
        scores.push(0);
        matching[0].enemy = matching[1];
        matching[1].enemy = matching[0];
        matching[1].setSide(1);

      }

      p5.draw = function () {
        if (countdown > 0) countdown -= speedUp;
        else if (scores[0] !== scores[1] || scores[0] === 0) {
          countdown = 100;
          let winner = matching[0].name;
          if (scores[1] > scores[0]) {
            winner = matching[1].name;
          }
          if (scores[0] === scores[1]) winner = 'none'
          leaderboard.forEach(entry => {
            if (entry.name === matching[0].name || entry.name === matching[1].name) {
              entry.matches++;
              if(entry.name === matching[0].name){
                entry.goals += scores[0];
                entry.conceded += scores[1];
                entry.difference = entry.goals-entry.conceded;
              }else {
                entry.goals += scores[1];
                entry.conceded += scores[0];
                entry.difference = entry.goals-entry.conceded;
              }
              if (winner === 'none') {
                entry.draw++;
                entry.points++;
              } else if (winner === matching[0].name) {
                if (entry.name === matching[0].name) {
                  entry.win++;
                  entry.points+= 3;
                } else {
                  entry.lost++;
                }
              } else {
                if (entry.name === matching[1].name) {
                  entry.win++;
                  entry.points+= 3;
                } else {
                  entry.lost++;
                }
              }
            }
          })
          EventBus.$emit('newLeaderboard', leaderboard);
          gameWon = true;
        }
        if (!gameWon) {
          p5.background(0);
          for (let i = 0; i < speedUp; i++) {
            matching[0].logic();
            matching[1].logic();

            goals.forEach((goal) => {
              goal.update();
              if (matching[0].camp.withinBorders(goal.pos)) {
                goal.timer--;
                if (goal.timer === 0) {
                  splashes.push(new Splash(goal.pos, 3, matching[0].color, 10, 2, 25, p5));
                  goal.reset();
                  scores[0]++;
                  matching[0].score++;
                }
              } else if (matching[1].camp.withinBorders(goal.pos)) {
                goal.timer--;
                if (goal.timer === 0) {
                  splashes.push(new Splash(goal.pos, 3, matching[1].color, 10, 2, 25, p5));
                  goal.reset();
                  scores[1]++;
                  matching[1].score++;
                }
              }
            })
            goals.forEach((goal) => {
              goals.forEach((goal2) => {
                goal.collide(goal2);
              })
            })
          }
          matching[0].draw();
          matching[1].draw();
          goals.forEach(goal => {
            goal.draw();
          })
          for (let i = 0; i < splashes.length; i++) {
            splashes[i].update();
            if (splashes[i].fertig) {
              splashes.shift();
              i--;
            } else {
              break;
            }
          }
          p5.textAlign(p5.RIGHT, p5.TOP);
          let text = Math.floor(countdown / 60.0);
          if (countdown === 0) text = "GOLDEN GOAL"
          p5.fill(255);
          p5.stroke(255);

          p5.text(text, p5.width - 20, 20);
        } else {
          if (countdown > 0) {
            p5.fill(125, 125, 125, 1);
            p5.rect(0, 0, p5.width * 4, p5.height * 4);
            p5.textAlign(p5.CENTER, p5.CENTER);
            let winner = matching[0].name;
            p5.stroke(matching[0].color.red, matching[0].color.green, matching[0].color.blue);
            p5.fill(matching[0].color.red, matching[0].color.green, matching[0].color.blue);
            if (scores[1] > scores[0]) {
              winner = matching[1].name;
              p5.stroke(matching[1].color.red, matching[1].color.green, matching[1].color.blue);
              p5.fill(matching[1].color.red, matching[1].color.green, matching[1].color.blue);
            }
            p5.strokeWeight(0.1);
            p5.textSize(40);
            let text = winner + ' has won this match!'
            if (scores[0] === scores[1]) text = 'it is a tie'

            p5.text(text, p5.width / 2, p5.height / 2);
          } else {
            countdown = initialCountdown;
            gameWon = false;
            leaderboard.sort(function (a,b) {
              return a.matches - b.matches;
            });
            leaderboard.reverse();
            let sliceInd = 0;
            for(let i = 0; i < leaderboard.length; i++){
              if(leaderboard[i].matches < leaderboard[0].matches){
                sliceInd = i;
                break;
              }
            }
            let remaining = leaderboard;
            if(sliceInd > 0) {
              remaining = leaderboard.slice(sliceInd,leaderboard.length);
            }
            if(remaining.length <= 1) {
              leaderboard[sliceInd].win++;
              leaderboard[sliceInd].points += 3;
              leaderboard[sliceInd].matches++;
              EventBus.$emit('newLeaderboard', leaderboard);
            }else {
              remaining.sort(function (a, b) {
                return b.points - a.points;
              });
              players.forEach(player => {
                if (player.name === remaining[0].name) {
                  matching[0] = player;
                }else if(player.name === remaining[1].name){
                  matching[1] = player;
                }
              })
              scores[0] = 0;
              scores[1] = 1;
              matching[0].enemy = matching[1];
              matching[1].enemy = matching[0];
              matching[1].setSide(1);
              matching[0].setSide(0);
            }
          }
        }
      }
    },
    getFiles(files) {
      this.p5 = new P5((p5) => {
        this.p5script(p5, files, EventBus)
      })
    }
  }
}
</script>

<style scoped>

</style>