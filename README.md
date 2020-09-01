# Seekers

Compete with your friends in this Programming tournament

## Description

### General

In Seekers, you Program different Bots that then compete against each
other to see who programmed the best one.
The Goal of the game is to collect as many 'goals' as you can while stopping your enemy from doing the same. 
Whoever scores the most at the end of the game wins! 

For this the so called 'seekers' are equipped with magnets that can attract or push away the goals. 
To disrupt your enemy from collecting goals, you can ram their seekers with your own. 
This results in both seekers being stunned for a short while. 
If however the enemy seeker had their magnet activated but yours didn't, only the enemy seeker will be disabled! 

All in all if you want to win, you have to find a balance between disrupting your enemy and getting goals yourself. 

This basic premise is augmented by adding different types of seekers. 
For example a faster seeker with a weaker magnetic field, or a seeker, that can shoot at his enemy's and disable them.

### Seekers

#### Seeker

The basic seeker, nothing too special, but also not useless.

##### Stats:
- Radius: 5
- Mass: 3
- Max. Speed: 1.25
- Magnet Pull-strength: 0.75
- Magnet Push-strength: 1
- Slowdown factor by activated magnet (max Speed will be divided by this factor) : 3
- Stunned time: 60 

#### Speedy

A faster seeker that has an almost useless magnet and stays inactive after ramming a little bit longer.


##### Stats:
- Radius: 4
- Mass: 2
- Max. Speed: 2.5
- Magnet Pull-strength: 0.33
- Magnet Push-strength: 0.4
- Slowdown factor: 4
- Stunned time: 90 

#### Chunky

A big seeker with a very strong magnetic field, and short recovery after a ram.


##### Stats:
- Radius: 6
- Mass: 5
- Max. Speed: 0.875
- Magnet Pull-strength: 1.25
- Magnet Push-strength: 1.75
- Slowdown factor: 1.5
- Stunned time: 45 

#### Tank

A seeker that can shoot at a position and disable up to one target. Bullets are blocked by any object and all seekers will collide with them as if it were a seeker.

You can adjust the size of the bullet and thereby the speed at witch it travels.

##### Stats:
- Radius: 4
- Mass: 2
- Max. Speed: 0.5
- Magnet Pull-strength: 0.75
- Magnet Push-strength: 1
- Slowdown factor: 1.25
- Stunned time: 120
- Magazine: 6
- Reload: 200
- Magazine reload: 1000

#### Shield

A seeker that can activate a Shield around himself that blocks all enemy seekers and bullets.

The magnet however cannot be controlled and is pulling at all times

The Shield cannot be activated at all times, when inactive it slowly regenerates. 
The bigger the shield the less time it can be activated.


##### Stats:
- Radius: 4
- Mass: 2
- Max. Speed: 1
- Magnet Pull-strength: 0.375
- Magnet Push-strength: -
- Slowdown factor: 1
- Stunned time: 120
- Max. shield-energy: 150
- Shield recovery: 2.5
- Max. shield radius: 16
- Max. shield consumption: 4
- Min. shield consumption: 2


## Usage

Run ``seekers.html`` in your Browser and choose the Bots to compete against each other 

### Bots

#### Requirements

A Bot for Seekers has to:
 - be inside a class bot that extends AbstractBot
 - have the function update that is called every frame
 - have ``player ``as an argument in the constructor and call ``super(player)`` in it
 - use at most 5 seekers at a time
 
 All Bots have to follow this basic shape: 
 
 ````
class bot extends AbstractBot {
    constructor(player) {
        super(player);
        for(let i = 0; i < this.player.max; i++) {
            this.addSeeker();
        }
    }

    update() {
    }
}

````

#### Functions

To add the different Seeker Types you can use the ``addSeeker()`` function. To add different seeker types instead use ``add + TYPE ``, for example ``addSpeedy()``

Some quality of life functions include: 

- ``dist(v1,v2)``: calculates the distance between the vectors v1 and v2, also compensates for going through the edges
- ``getNearest(pos,list)``: returns the closest gameObject in the list to the given position
- ``getNearestList(pos,list)``: sorts the elements of the given list by their proximity to the given position
