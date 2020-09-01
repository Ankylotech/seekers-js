let initialized = false;
let loading = true;
let files = [];
let loaded = -1;
let matching = [];
let players = [];
let goals = [];
let goalNum = 7;
let maxSeekers = 5;
let scores = [];
let countdown = 7200;
let initialCountdown = countdown;
let gameWon = false;
let speedUp = 2;
let splashes = [];
let leaderboard = [];
let games = 0;
let sorters = ['points', 'win', 'difference', 'goals'];

function setup() {

}

function draw() {
    if (files.length > 1 && !initialized) {
        console.log('let\'s GO!');
        initialize();
    } else if (files.length == loaded && loading) {
        matching.push(players[0]);
        matching.push(players[1]);
        scores.push(0);
        scores.push(0);
        matching[0].enemy = matching[1];
        matching[1].enemy = matching[0];
        matching[1].setSide(1);
        loading = false;
    } else if (files.length == loaded) {
        displayLeaderboard();
        if (games === players.length * (players.length - 1)) {
            background(0);
            let winner = leaderboard[0];
            textAlign(CENTER, CENTER);
            stroke(255);
            fill(255);
            textSize(40);
            this.text(winner.name + ' hat das Turnier Gewonnen! Gratuliere!', width / 2, height / 2);
        } else {
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
                        if (entry.name === matching[0].name) {
                            entry.goals += scores[0];
                            entry.conceded += scores[1];
                            entry.difference = entry.goals - entry.conceded;
                        } else {
                            entry.goals += scores[1];
                            entry.conceded += scores[0];
                            entry.difference = entry.goals - entry.conceded;
                        }
                        if (winner === 'none') {
                            entry.draw++;
                            entry.points++;
                        } else if (winner === matching[0].name) {
                            if (entry.name === matching[0].name) {
                                entry.win++;
                                entry.points += 3;
                            } else {
                                entry.lost++;
                            }
                        } else {
                            if (entry.name === matching[1].name) {
                                entry.win++;
                                entry.points += 3;
                            } else {
                                entry.lost++;
                            }
                        }
                    }
                })
                gameWon = true;
            }
            if (!gameWon) {
                background(0);
                for (let i = 0; i < speedUp; i++) {
                    matching[0].logic();
                    matching[1].logic();

                    goals.forEach((goal) => {
                        goal.update();
                        if (matching[0].camp.withinBorders(goal.pos)) {
                            goal.timer--;
                            if (goal.timer === 0) {
                                splashes.push(new Splash(goal.pos, 3, matching[0].color, 10, 2, 25));
                                goal.reset();
                                scores[0]++;
                                matching[0].score++;
                            }
                        } else if (matching[1].camp.withinBorders(goal.pos)) {
                            goal.timer--;
                            if (goal.timer === 0) {
                                splashes.push(new Splash(goal.pos, 3, matching[1].color, 10, 2, 25));
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
                    for (let i = 0; i < splashes.length; i++) {
                        splashes[i].update();
                        if (splashes[i].fertig) {
                            splashes.shift();
                            i--;
                        } else {
                            break;
                        }
                    }
                }
                matching[0].camp.draw();
                matching[1].camp.draw();
                matching[0].draw();
                matching[1].draw();
                goals.forEach(goal => {
                    goal.draw();
                })
                textAlign(RIGHT, TOP);
                let text = Math.floor(countdown / (60.0 * speedUp));
                fill(255);
                stroke(255);
                if (countdown === 0) {
                    text = "GOLDEN GOAL"
                    fill(255, 0, 0);
                    stroke(255, 0, 0);
                }
                this.text(text, width - 20, 20);
            } else {
                if (countdown > 0) {
                    fill(125, 125, 125, 1);
                    rect(0, 0, width * 4, height * 4);
                    textAlign(CENTER, CENTER);
                    let winner = matching[0].name;
                    stroke(matching[0].color.red, matching[0].color.green, matching[0].color.blue);
                    fill(matching[0].color.red, matching[0].color.green, matching[0].color.blue);
                    if (scores[1] > scores[0]) {
                        winner = matching[1].name;
                        stroke(matching[1].color.red, matching[1].color.green, matching[1].color.blue);
                        fill(matching[1].color.red, matching[1].color.green, matching[1].color.blue);
                    }
                    strokeWeight(0.1);
                    textSize(40);
                    let text = winner + ' has won this match!'
                    if (scores[0] === scores[1]) text = 'it is a tie'

                    this.text(text, width / 2, height / 2);
                } else {
                    countdown = initialCountdown;
                    gameWon = false;
                    games++;
                    leaderboard.sort(function (a, b) {
                        return a.matches - b.matches;
                    });
                    leaderboard.reverse();
                    let sliceInd = 0;
                    for (let i = 0; i < leaderboard.length; i++) {
                        if (leaderboard[i].matches < leaderboard[0].matches) {
                            sliceInd = i;
                            break;
                        }
                    }
                    let remaining = leaderboard;
                    if (sliceInd > 0) {
                        remaining = leaderboard.slice(sliceInd, leaderboard.length);
                    }
                    if (remaining.length <= 1) {
                        leaderboard[sliceInd].win++;
                        leaderboard[sliceInd].points += 3;
                        leaderboard[sliceInd].matches++;
                        leaderboard = sortLeaderboard(leaderboard)
                        players.forEach(player => {
                            if (player.name === leaderboard[0].name) {
                                matching[0] = player;
                            } else if (player.name === leaderboard[1].name) {
                                matching[1] = player;
                            }
                        })
                        scores[0] = 0;
                        scores[1] = 0;
                        matching[0].enemy = matching[1];
                        matching[1].enemy = matching[0];
                        goals.forEach(goal => {
                            goal.reset();
                        })
                        matching[1].setSide(1);
                        matching[0].setSide(0);
                    } else {
                        remaining = sortLeaderboard(remaining)
                        players.forEach(player => {
                            if (player.name === remaining[0].name) {
                                matching[0] = player;
                            } else if (player.name === remaining[1].name) {
                                matching[1] = player;
                            }
                        })
                        scores[0] = 0;
                        scores[1] = 0;
                        matching[0].enemy = matching[1];
                        matching[1].enemy = matching[0];
                        goals.forEach(goal => {
                            goal.reset();
                        })
                        matching[1].setSide(1);
                        matching[0].setSide(0);
                    }
                }
            }
        }
    }
}

function initialize() {
    loaded = 0;
    initialized = true;
    setFrameRate(60);
    let canvas = createCanvas(1000, 500);
    canvas.parent("p5Canvas");
    for (let i = 0; i < goalNum; i++) {
        goals.push(new Goal());
    }

    for (let i = 0; i < files.length; i++) {
        let name = files[i].name.substring(0, files[i].name.length - 3)
        let reader = new FileReader();
        reader.readAsText(files[i], "UTF-8");
        reader.onload = function (text) {
            players.push(new Player(text.target.result, 0, goals, maxSeekers, name));
            leaderboard.push({
                name: name,
                points: 0,
                win: 0,
                draw: 0,
                lost: 0,
                matches: 0,
                goals: 0,
                conceded: 0,
                difference: 0,
            })
            loaded++;
        }

    }

}

function sortLeaderboard(leaders){
    leaders.sort( (a,b) => {
        for(let i = 0; i < sorters.length; i++){
            if(a[sorters[i]] != b[sorters[i]]) return b[sorters[i]] - a[sorters[i]];
        }
        return 0;
    })
    return leaders
}

function displayLeaderboard(){
    let list = document.getElementById("leaderboard");
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    leaderboard = sortLeaderboard(leaderboard);
    leaderboard.forEach(player => {
        let li = document.createElement('li');
        list.appendChild(li);

        let dl = document.createElement('dl');
        li.appendChild(dl);
        Object.keys(player).forEach(key => {
            let dt = document.createElement('dd');
            let text = key + ': ' + player[key];
            if(key == 'name') {
                dt = document.createElement('dt');
                text = player[key];
            }
            dl.appendChild(dt);
            dt.innerHTML = text;
        })
    })
}