var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create});


function preload(){
	game.load.image('background', 'assets/purge.jpg');
	game.load.spritesheet('aladdin', 'assets/aladdin.png', 32, 48, 16)
	game.load.spritesheet('belle', 'assets/belle.png', 32, 48, 16)
	game.load.spritesheet('textBox', 'assets/textBoxes.png')
	game.load.spritesheet('battleScreen', 'assets/battleBackgrounds.png')


	game.state.add('levelOne', levelOne)
	game.state.add('menu', gameMenu)
	game.state.add('battle', battleScreen)
	console.log("preload")

	dialogueFlag = 0
}

function create(){
	game.physics.startSystem(Phaser.Physics.ARCADE);
	console.log('create')
	game.state.start('menu')

}

function battle(){
	game.state.start('battle')

}

var battleScreen = {

	create: function(){
		var image = game.add.sprite(0,0, 'battleScreen')
		var enemyImage = game.add.sprite(550, 200, villain.sprite, 0)
		enemyImage.scale.set(3,3)
		var enemyName = game.add.text(150, 110, villain.name)
		var enemyHealth = game.add.text(150, 140, 'Health:' + villain.health)
		var playerImage = game.add.sprite(100, 450, 'aladdin', 12)
		playerImage.scale.set(5,5)

		var playerSkills = game.add.group();
		playerSkills = {'Fight':'Kick', 'Item':'Lamp'}

		for (i=0;i<=1;i++){
			game.add.text(500, 450 + (i * 30), Object.keys(playerSkills)[i])
		}

		var cursor = playerSkills.cursor
	}


}

var gameMenu = {


	create: function(){
		var image = game.add.sprite(0,0,'background')

		image.scale.set(1.2,2)

		this.keyboard = game.input.keyboard;

		var startGame = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

		startGame.onDown.add(function(){
			game.state.start('levelOne')
		})

		this.state.update = function(){}
	}
}


var levelOne = {
	create: function(){

		var pressY = game.input.keyboard.addKey(Phaser.Keyboard.Y);
		var pressSpace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

		function movementControls(){

			levelOne.state.update = function(){

			player.body.velocity.x = 0
			player.body.velocity.y = 0
			game.physics.arcade.collide(player, person);
			cursors = game.input.keyboard.createCursorKeys();

			if (cursors.left.isDown){
			player.animations.play('left')
			player.body.velocity.x = -150
			} else if (cursors.right.isDown){
			player.animations.play('right')
			player.body.velocity.x = 150
			} else if (cursors.up.isDown){
			player.animations.play('up')
			player.body.velocity.y = -150
			}  else if (cursors.down.isDown){
			player.animations.play('down')
			player.body.velocity.y = 150
			}
			else {
			player.animations.stop();
			}

			}
		}

		function dialogue(encounter) {
			
			//Stop velocity to prevent player movement during dialogue
			player.body.velocity.x = 0
			player.body.velocity.y = 0

			// battle("belle");

			dialogueFlag = 1			
			var speech = encounter.text
			var i = -1 	//The downDuration functionwill immediately fire setting i to 0
			textBox = game.add.sprite(0, 500, 'textBox')

			textDisplay = game.add.text(50, 532, speech[0],{fill: "#444444"});

			levelOne.state.update = function(){
				if (game.input.keyboard.downDuration(32,1)){
					i++;
					textDisplay.destroy();
					textDisplay = game.add.text(50, 532, speech[i],{fill: "#444444"});
				}

				//-1 ommitted from speech.length lets pressing space close the box
				if (i == (speech.length)){

					if (encounter.battle == 1){
						villain = encounter.enemy
						battle("we fightin now")
					} else {
					textDisplay.destroy();
					textBox.destroy()
					dialogueFlag = 0;
					movementControls();
					return
					}
				}
			}
		}

		person = game.add.group();
		person.enableBody = true

		var belle = person.create(game.world.width/2, game.world.height/2, 'belle');
		belle.body.immovable = true
		belle.body.physicsBodyType = Phaser.Physics.ARCADE;
		belle.body.setSize(24,36)

		var enemyBelle = {'name': "Belle", 'sprite': 'belle', 'health' : 25}

		var player = game.add.sprite(32, game.world.height - 150, 'aladdin');
		player.enableBody = true

		player.animations.add('down', [0, 1, 2, 3], 4, true);
		player.animations.add('left', [4, 5, 6, 7], 4, true);
		player.animations.add('right', [8, 9, 10, 11], 4, true);
		player.animations.add('up', [12, 13, 14, 15], 4, true);

		player.animations.stop
		game.physics.enable(player,Phaser.Physics.ARCADE);
		game.physics.arcade.enable(person)
		player.body.collideWorldBounds = true

		player.frame = 0

		pressY.onDown.add(function(){
			game.state.start('menu')
		})

		this.state.update = function(){

			movementControls();

			pressSpace.onDown.add(function(){
				if (game.physics.arcade.distanceBetween(player,belle) <= 45 && dialogueFlag==0){
					dialogue({text: ["Oh hello...street rat.","Why The Purge is a tale as old as time!","It's purging time!"], battle: 1, enemy: enemyBelle});
					}
				})
			}
		}

 	}
