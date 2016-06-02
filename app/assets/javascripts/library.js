var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create});


function preload(){
	game.load.image('background', 'assets/purge.jpg');
	game.load.spritesheet('aladdin', 'assets/aladdin.png', 32, 48, 16)
	game.load.spritesheet('belle', 'assets/belle.png', 32, 48, 16)
	game.load.spritesheet('textBox', 'assets/textBoxes.png')

	game.state.add('levelOne', levelOne)
	game.state.add('menu', gameMenu)
	console.log("preload")

}

function create(){
	game.physics.startSystem(Phaser.Physics.ARCADE);
	console.log('create')
	game.state.start('menu')

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

		function dialogue(text) {

			var speech = text
			levelOne.state.update = function(){
				console.log(speech[0])
			}

		}

		person = game.add.group();
		person.enableBody = true

		var belle = person.create(game.world.width/2, game.world.height/2, 'belle');
		belle.body.immovable = true
		belle.body.physicsBodyType = Phaser.Physics.ARCADE;
		belle.body.setSize(24,36)

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

			pressSpace.onDown.add(function(){
				if (game.physics.arcade.distanceBetween(player,belle) <= 45){
					game.add.sprite(0, 500, 'textBox')
					game.add.text(50, 532, "Get away!",{fill: "#444444"});
					dialogue(["Oh hello...street rat.","It's purging time!"]);
				}

			})
			// if (game.physics.arcade.distanceBetween(player,belle) <= 45 && pressSpace.onDown){
			// 	game.add.text(game.world.centerX, game.world.centerY, "Get away!",{fill: "#ffffff"})

			if (cursors.left.isDown){
			player.animations.play('left')
			player.body.velocity.x = -150
			
			}
				pressSpace.onDown.add(function(){
					cursors = true
				})
				console.log('ok')
			}
		}


 	}

 	// this.update = function(){}


// }
