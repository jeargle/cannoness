var score, bootState, loadState, titleState, playState, endState, game;

score = 0;

bootScene = {
    key: 'boot',
    active: true,
    init: (config) => {
        console.log('[BOOT] init', config);
    },
    preload: () => {
        console.log('[BOOT] preload');
    },
    create: function() {
        'use strict';

        game.scene.start('load');
        game.scene.remove('boot');
    },
    update: () => {
        console.log('[BOOT] update');
    }
};

// loadState = {
//     preload: function() {
//         'use strict';
//         var loadLbl;

//         loadLbl = game.add.text(80, 160, 'loading...',
//                                 {font: '30px Courier',
//                                  fill: '#ffffff'});

//         // Load images
//         game.load.image('player', 'assets/square-red.png');
//         game.load.image('enemy', 'assets/square-blue.png');
//         game.load.image('platform', 'assets/square-green.png');
//         game.load.image('ball', 'assets/ball.png');

//         // Load sound effects
//     },
//     create: function() {
//         'use strict';
//         game.state.start('title');
//     }
// };

loadScene = {
    key: 'load',
    renderToTexture: true,
    x: 64,
    y: 64,
    width: 320,
    height: 200,
    init: (config) => {
        console.log('[LOAD] init', config);
    },
    preload: function() {
        'use strict';
        var loadLbl;

        loadLbl = this.add.text(80, 160, 'loading...',
                                {font: '30px Courier',
                                 fill: '#ffffff'});

        // Load images
        this.load.image('player', 'assets/square-red.png');
        this.load.image('enemy', 'assets/square-blue.png');
        this.load.image('platform', 'assets/square-green.png');
        this.load.image('ball', 'assets/ball.png');

        // Load sound effects
    },
    create: function() {
        'use strict';
        game.scene.start('title');
        game.scene.remove('load');
    },
    update: () => {
        console.log('[LOAD] update');
    }
};

titleState = {
    create: function() {
        'use strict';
        var nameLbl, startLbl, wKey;

        nameLbl = game.add.text(80, 160, 'CANNONESS',
                                {font: '50px Courier',
                                 fill: '#ffffff'});
        startLbl = game.add.text(80, 240, 'press "W" to start',
                                 {font: '30px Courier',
                                  fill: '#ffffff'});

        wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        wKey.onDown.addOnce(this.start, this);
    },
    start: function() {
        'use strict';
        game.state.start('play');
    }
};

playState = {
    create: function() {
        'use strict';
        var block, i, ball;

        this.keyboard = game.input.keyboard;

        game.physics.startSystem(Phaser.Physics.ARCADE);


        // Platforms
        this.platforms = game.add.group();
        this.platforms.enableBody = true;

        // Ground
        block = this.platforms.create(0, game.world.height - 32, 'platform');
        block.scale.setTo(25, 1);
        block.body.immovable = true;
        block.body.moves = false;

        block = this.platforms.create(0, 0, 'platform');
        block.scale.setTo(25, 1);
        block.body.immovable = true;
        block.body.moves = false;

        // Walls
        block = this.platforms.create(0, 32, 'platform');
        block.scale.setTo(1, 17);
        block.body.immovable = true;
        block.body.moves = false;

        block = this.platforms.create(game.world.width - 32, 32, 'platform');
        block.scale.setTo(1, 17);
        block.body.immovable = true;
        block.body.moves = false;

        // Ledges
        block = this.platforms.create(0, 250, 'platform');
        block.scale.setTo(8, 1);
        block.body.immovable = true;

        block = this.platforms.create(100, 275, 'platform');
        block.scale.setTo(8, 1);
        block.body.immovable = true;

        block = this.platforms.create(200, 350, 'platform');
        block.scale.setTo(8, 1);
        block.body.immovable = true;

        block = this.platforms.create(300, 425, 'platform');
        block.scale.setTo(8, 1);
        block.body.immovable = true;

        block = this.platforms.create(400, 500, 'platform');
        block.scale.setTo(8, 1);
        block.body.immovable = true;

        // Player
        this.player = game.add.sprite(64, game.world.height - 150, 'player');
        this.player.anchor.setTo(0.5, 0.5);
        this.playerSpeed = 300;
        this.jumpSpeed = 600;

        this.jumping = false;
        this.newJump = true;

        game.physics.arcade.enable(this.player);

        // Ball
        this.balls = game.add.group();
        this.balls.enableBody = true;
        this.balls.physicsBodyType = Phaser.Physics.ARCADE;
        this.balls.createMultiple(5, 'ball');
        this.balls.setAll('anchor.x', 0.5);
        this.balls.setAll('anchor.y', 0.5);
        this.balls.setAll('outOfBoundsKill', true);
        this.balls.setAll('checkWorldBounds', true);
        // this.balls.setAll('bounce', 1);
        // for (i=0; i<5; i++) {
        //     ball = this.balls.create('ball');
        //     ball.anchor.setTo(0.5, 0.5);
        //     ball.body.bounce.set(1);
        // }

        this.ballSpeed = 300;
        this.ballTime = 0;
        this.ballTimeOffset = 300;
        this.ballDirection = 'right';

        // Gravity
        this.gravity = 2000;
        this.player.body.gravity.y = this.gravity;
        // this.player.body.collideWorldBounds = true;
        // this.balls.gravity.y = this.gravity;
        // this.balls.collideWorldBounds = true;

        // Controls
        this.cursors = game.input.keyboard.addKeys({
            'up': Phaser.Keyboard.W,
            'down': Phaser.Keyboard.S,
            'left': Phaser.Keyboard.A,
            'right': Phaser.Keyboard.D,
            'jump': Phaser.Keyboard.SPACEBAR,
            'fire': Phaser.Keyboard.SHIFT
        });

    },
    update: function() {
        'use strict';

        game.physics.arcade.collide(this.player, this.platforms);
        game.physics.arcade.collide(this.balls);
        game.physics.arcade.collide(this.balls, this.platforms);
        game.physics.arcade.overlap(this.player, this.balls,
                                    this.grabBall, null, this);
        game.physics.arcade.overlap(this.balls, this.balls,
                                    this.separateBalls, null, this);

        this.player.body.velocity.x = 0;
        if (this.cursors.right.isDown) {
            this.player.body.velocity.x = this.playerSpeed;
            this.ballDirection = 'right';
        }
        else if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -this.playerSpeed;
            this.ballDirection = 'left';
        }
        else if (this.cursors.up.isDown) {
            this.ballDirection = 'up';
        }
        else if (this.cursors.down.isDown) {
            this.ballDirection = 'down';
        }

        if (this.player.body.touching.down) {
            this.jumping = false;
            if (!this.cursors.jump.isDown) {
                this.newJump = true;
            }
        }
        else {
            this.jumping = true;
            this.newJump = false;
        }

        if (this.cursors.jump.isDown &&
            !this.jumping && this.newJump) {
            this.jumping = true;
            this.newJump = false;
            this.player.body.velocity.y = -this.jumpSpeed;
        }

        if (this.cursors.fire.isDown) {
            this.fire();
        }
    },
    fire: function() {
        'use strict';
        var ball;

        console.log('fire()');

        if (game.time.now > this.ballTime) {
            this.ballTime = game.time.now + this.ballTimeOffset;
            ball = this.balls.getFirstExists(false);

            if (ball) {
                ball.body.bounce.set(0.1);
                ball.body.drag.set(50);
                // ball.body.setCircle(8);
                if (this.ballDirection === 'right' &&
                    !this.player.body.touching.right) {
                    ball.reset(this.player.x + 32, this.player.y);
                    ball.body.velocity.x = this.ballSpeed;
                    ball.body.velocity.y = -100;
                    ball.body.gravity.y = this.gravity/10;
                }
                else if (this.ballDirection === 'left' &&
                         !this.player.body.touching.left) {
                    ball.reset(this.player.x - 32, this.player.y);
                    ball.body.velocity.x = -this.ballSpeed;
                    ball.body.velocity.y = -100;
                    ball.body.gravity.y = this.gravity/10;
                }
                else if (this.ballDirection === 'up' &&
                         !this.player.body.touching.up) {
                    ball.reset(this.player.x, this.player.y - 32);
                    ball.body.velocity.y = -this.ballSpeed;
                    ball.body.gravity.y = this.gravity/10;
                }
                else if (this.ballDirection === 'down' &&
                         !this.player.body.touching.down) {
                    ball.reset(this.player.x, this.player.y + 32);
                    ball.body.velocity.y = this.ballSpeed;
                    ball.body.gravity.y = this.gravity/10;
                }
            }
            else {
                console.log('no ball available');
            }
        }
    },
    grabBall: function(player, ball) {
        'use strict';

        ball.kill();
    },
    separateBalls: function(ball1, ball2) {

    },
    end: function() {
        'use strict';
        game.state.start('end');
    }
};

endState = {
    create: function() {
        'use strict';
        var scoreLbl, nameLbl, startLbl, wKey;

        scoreLbl = game.add.text(600, 10, 'Score: ' + score,
                                 {font: '30px Courier',
                                  fill: '#ffffff'});
        nameLbl = game.add.text(80, 160, 'YOU DIED',
                                {font: '50px Courier',
                                 fill: '#ffffff'});
        startLbl = game.add.text(80, 240, 'press "W" to restart',
                                 {font: '30px Courier',
                                  fill: '#ffffff'});

        wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        wKey.onDown.addOnce(this.restart, this);
    },
    restart: function() {
        'use strict';
        game.state.start('title');
    }
};


const gameConfig = {
    // type: Phaser.CANVAS,
    type: Phaser.AUTO,
    parent: 'game-div',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [bootScene,
            loadScene,
            // titleScene, playScene, endScene
           ]
};

game = new Phaser.Game(gameConfig);
game.scene.start('boot', { someData: '...arbitrary data' });

// game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-div');

// game.state.add('boot', bootState);
// game.state.add('load', loadState);
// game.state.add('title', titleState);
// game.state.add('play', playState);
// game.state.add('end', endState);

// game.state.start('boot');
