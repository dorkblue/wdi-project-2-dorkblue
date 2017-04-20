![logo](http://i.imgur.com/H94aR3F.png?1) **awan** - a *'Cloud'*-based patient database
=====
Gone are the days when pen and paper are mightier than the sword.

Getting Started
------
1. Fork this repo and clone
2. Set up environment values in .env.sample (instructions given in file)
3. npm install packages in terminal
4. Set up mongodb connection, and create `users` collection
5. Create user with `type: admin`
```Javascript
{
      username: <any String>
      password: <any 8 letters String>
      email: <email String>
      type: 'admin'
}
```
6. npm start, go to browser and access http://localhost:7777 and *wallah!*


## User Story
The intended target market of this app is essentially clinics that are still using paper and filing system to store the records of patients information.

The idea is to provide an **easy-to-use** web app that is hassle-free and adaptable to the needs of the clinic. *(internet connection not required!)*


The end goal here is to increase the efficiency and reduce the amount of work dealing with the increasing patient records and database. *(saves physical space too!)*
[Momo the Wizard](https://wdi-sg.github.io/wdi-project-1-dorkblue/)

## How To Play The Game
![howtoplay](http://i.imgur.com/WaKENsZ.png "How to play")

1. This is a one player game vs AI
2. AI will 'cast' a spell around the yellow box area on the right
3. To counter the spell casted, type the counter spell on the input box below
4. All the counter spells will be shown on the long yellow box on the right
5. The right counter to type is the one that is displayed in black
6. Some spells that cannot be countered will not be displayed on the right yellow box. Type dodge to prevent damage.
7. Spells that needs to be 'dodged' will kill player instantly if player did not type 'dodge' in time
8. A timer bar will run on top of the input bar to indicate time left to type the counter spell
9. Each successful counter by the player will reduce the number of hearts of the AI
10. To win the game, reduce the heart of AI to zero hearts while making sure your hearts does not go to zero

Tip: To instantly remove all your inputs, press **_SHIFT_**.

Challenge yourself after a few rounds of practice by playing the 'lunatic' mode.

## Getting Started
###### If you would like to improve/add features to the game


>https://github.com/wdi-sg/wdi-project-1-dorkblue.git

1. Git clone link above on your terminal
2. Open ```index.html``` on your code editor to edit html
>index.html
3. Open ```script.js``` to edit Javascript portion of the game
>assets/js/script.js
4. Open ```stylesheet.css``` to edit CSS portion of the game
>assets/css/stylesheet.css

## Development Stages

###### How the idea came into mind
I'm not the biggest fan of Harry Potter, but I always thought it would be cool (minus the possibility of dying) to be able to duel like the wizards do.

![duel](https://media.giphy.com/media/K6uXQIsER8Ple/giphy.gif "Potter vs Malfoy")


I'm also a huge fan of typing game (or any game, really) that requires dexterity.

![typing](https://media.giphy.com/media/o0vwzuFwCGAFO/giphy.gif "Cat typing")

![typing2](https://media.giphy.com/media/hOzfvZynn9AK4/giphy.gif "Robin typing")

And this is how the idea of making a spell typing game came along.

## The Rough Idea or 'BEING AMBITIOUS' stage
1. A typing game that requires the player to not type what is being shown
2. With some elements of RPG (Role-playing game)
3. REALLY cool spell graphics
4. Different opponents with different spell sets and quotes with reference to the actual Harry Potter franchise.
5. AI capable of casting random spell at a random time
6. Random event (magical weather, darkness) that changes the game board, that can be solved with spells (meteolojinx recanto, lumos maxima)
7. Typing healing spells regain hearts

## Actual Coding stage
With ```Prima's (WDI Instructor)``` blessing, I started to work on the early version of the game.

From the start, I've used **Object-Oriented Programming** because

1. Shorter code, easy to read and organize
2. **Constructor** makes storing variables (property) & re-using those variables a piece of cake (prevents problem caused by hoisting)
3. Reusability of prototype **method** for multiple instances

### Version 1:
![v1](http://i.imgur.com/MmYpEef.png "Version 1")

>Built the core mechanics/skeleton of the game.

My focus was working on the game logic and making sure that at least 70% of it is working.

#### The Core Mechanics:

**Method to output the spell 'casted' by AI**
```Javascript
Enemy.prototype.cast = function () {
  // generate random spells
  var num = Math.floor(Math.random() * this.spells.length)

  this.currentCast = this.spells[num].name
  this.currentCounter = this.spells[num].counter
  this.countdown = this.spells[num].time * 1000

  $h2.text(this.currentCast)
  $counterForCurrent.text(this.currentCounter)
  this.castTimer = window.setTimeout(this.damage.bind(this, 'playerHP'), this.countdown)
}
```

**Method to check for player input**
```Javascript
  Enemy.prototype.playerInput = function () {
    if ($playerInput.val() === this.currentCounter) { // NOTE1.1: if counter is correct, then activate function
      this.damage('enemyHP')
    }
  }
  ```

  **Method to get random spells from spell database**
  ```Javascript
  Enemy.prototype.getSpells = function (number, compendiumToGetFrom) {
  var spellsPlaceholder = compendiumToGetFrom
  var spellList = []

  while (number !== spellList.length) {
    var RNG = Math.floor(Math.random() * spellsPlaceholder.length)
    var spellToInclude = spellsPlaceholder.splice(RNG, 1)

    spellList.push(spellToInclude)
  }
  spellList = spellList.reduce(function (accu, val) {
    console.log(accu, val)
    accu = accu.concat(val)
    return accu
  })
  console.log(spellList.length)
  return spellList
}
```

### Version 2:
![v2](http://i.imgur.com/tUM1m4a.png "Version 2")
>Reality check.
Realization that alot of my ambitious ideas may not be achievable in 1 week's time.

**Method to display correct number of hearts on screen**
```Javascript
Enemy.prototype.heartsDisplay = function (playerOrEnemy) {
  $lifebar = $('#' + playerOrEnemy)
  $life = $lifebar.find('div#life')
  $life.remove()

  var fullHeart = (this[playerOrEnemy] - this[playerOrEnemy] % 20) / 20

  var halfHeart = (this[playerOrEnemy] % 20) / 10

  for (var i = fullHeart; i > 0; i--) {
    $div = $('<div>')
    $div.attr('id', 'life')
    $img = $('<img>').attr('src', 'assets/image/full-heart.png')
    $div.append($img)
    $lifebar.append($div)
  }
  for (var j = halfHeart; j > 0; j--) {
    $div = $('<div>')
    $div.attr('id', 'life')
    $img = $('<img>').attr('src', 'assets/image/half-heart.png')
    $div.append($img)
    $lifebar.append($div)
  }
}
```

**Method to randomly select spell set to cast**
```Javascript
Enemy.prototype.preCast = function () {
  var num1 = Math.floor(Math.random() * this.skillSet1.length)
  var num2 = Math.floor(Math.random() * this.skillSet2.length)

  if (num1 > num2) {
    this.cast('skillSet1')
  } else if (num2 >= num1) {
    this.cast('skillSet2')
  }
}
```

#### Assets used:
![heartsprite](http://orig05.deviantart.net/29b0/f/2016/295/6/c/sprites_heart_life_by_yukikootomiye-dalt7ak.png "heart sprite")

![momogif](http://68.media.tumblr.com/e7cf7167ae9f6c6dc15cfd5d2f0c3726/tumblr_oftnddYA1g1qbm9nvo4_250.gif "momo gif")

![momogif2](http://68.media.tumblr.com/7238fab2d3818848c7e5887c7140a14b/tumblr_oftnddYA1g1qbm9nvo3_250.gif "momo dead")

### Version 3:
![v3](http://i.imgur.com/Y6xzYTs.png "Version 3")

>Game logic is 99% completed (or so I thought) sans code required for DOM manipulation.

#### Major problem faced:
1. When 'Play Again', sometimes game ends abruptly
2. When 'Play Again', loading bar that shows time left to type does not show

### Version 4: Final
![v4](https://media.giphy.com/media/aZO71ccCHo2QM/giphy.gif "version 4")


```JavaScript
$restartButton.on('click', function (e) {
  var evilmomo = null
  restartReset()
  if (e.currentTarget.id === 'easy') {
    evilmomo = new Enemy('Evil Momo', 10, 1, 60, 100, 1, 'easy')
  } else if (e.currentTarget.id === 'medium') {
    evilmomo = new Enemy('Evil Momo', 13, 3, 100, 100, 0, 'medium')
  } else if (e.currentTarget.id === 'hard') {
    evilmomo = new Enemy('Evil Momo', 13, 3, 100, 60, -1, 'hard')
  } else if (e.currentTarget.id === 'lunatic') {
    evilmomo = new Enemy('Evil Momo', 13, 3, 100, 30, -2, 'lunatic')
  }
  $('#staticinstruction').css('display', 'block')

  evilmomo.addListenerToInput()
  evilmomo.start()
})
```

# To improve
1. More variety of spells
2. Better & clearer way of conveying game instructions to player
3. Animation on events (AI casting spell, displaying the counter spell, when 'damaged') to make it more user friendly
4. Whatever that is lacking from 'BEING AMBITIOUS'

# Built With
* **JavaScript** - Game Logic
* **jQuery** - DOM Manipulation
* **CSS** - Aesthetics
* **HTML** - Web Page Structure
* **[ezgif](https://ezgif.com/)** - Gif editing

# Authors
Lee Shue Ze

# Acknowledgements/Credits
![gif](https://static1.squarespace.com/static/5331f0a8e4b054ff7c32dc3d/t/538febc0e4b07ccd65b40223/1401940949229/envys2.gif?format=500w)
* The very talented animator **[Olivia When](http://www.oliviawhen.com/)**
* The actual Momo game on [Google Doodle - Halloween 2016](https://www.google.com/doodles/halloween-2016)
* [YukikoOtomiye](http://yukikootomiye.deviantart.com/)
