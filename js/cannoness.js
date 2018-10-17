var score, bootScene, loadScene, titleScene, playScene, endScene, game;

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

// titleState = {
//     create: function() {
//         'use strict';
//         var nameLbl, startLbl, wKey;

//         nameLbl = game.add.text(80, 160, 'CANNONESS',
//                                 {font: '50px Courier',
//                                  fill: '#ffffff'});
//         startLbl = game.add.text(80, 240, 'press "W" to start',
//                                  {font: '30px Courier',
//                                   fill: '#ffffff'});

//         wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
//         wKey.onDown.addOnce(this.start, this);
//     },
//     start: function() {
//         'use strict';
//         game.state.start('play');
//     }
// };

titleScene = {
    key: 'title',
    init: (config) => {
        console.log('[TITLE] init', config);
    },
    preload: () => {
        console.log('[TITLE] preload');
    },
    create: function() {
        'use strict';
        var nameLbl, startLbl;

        nameLbl = this.add.text(80, 160, 'CANNONESS',
                                {font: '50px Courier',
                                 fill: '#ffffff'});
        startLbl = this.add.text(80, 240, 'press "W" to start',
                                 {font: '30px Courier',
                                  fill: '#ffffff'});

        this.input.keyboard.on('keydown_W', this.start, this);
    },
    update: () => {
        console.log('[TITLE] update');
    },
    extend: {
        start: function() {
            'use strict';
            console.log('[TITLE] start');
            game.scene.switch('title', 'play');
        }
    }
};


playState = {
    update: function() {
        'use strict';

    },
};

playScene = {
    key: 'play',
    create: function() {
        'use strict';
        var height, width, block, i, ball;

        console.log('[PLAY] create');

        // this.keyboard = game.input.keyboard;

        // game.physics.startSystem(Phaser.Physics.ARCADE);


        // Platforms
        this.platforms = this.physics.add.staticGroup();

        height = 600;
        width = 800;

        // Ground
        block = this.platforms.create(0, height - 32, 'platform')
            .setOrigin(0, 0)
            .setScale(25, 1)
            .refreshBody();

        block = this.platforms.create(0, 0, 'platform')
            .setOrigin(0, 0)
            .setScale(25, 1)
            .refreshBody();


        // Walls
        block = this.platforms.create(0, 32, 'platform')
            .setOrigin(0, 0)
            .setScale(1, 17)
            .refreshBody();

        block = this.platforms.create(width - 32, 32, 'platform')
            .setOrigin(0, 0)
            .setScale(1, 17)
            .refreshBody();

        // Ledges
        block = this.platforms.create(0, 250, 'platform')
            .setOrigin(0, 0)
            .setScale(8, 1)
            .refreshBody();

        block = this.platforms.create(100, 275, 'platform')
            .setOrigin(0, 0)
            .setScale(8, 1)
            .refreshBody();

        block = this.platforms.create(200, 350, 'platform')
            .setOrigin(0, 0)
            .setScale(8, 1)
            .refreshBody();

        block = this.platforms.create(300, 425, 'platform')
            .setOrigin(0, 0)
            .setScale(8, 1)
            .refreshBody();

        block = this.platforms.create(400, 500, 'platform')
            .setOrigin(0, 0)
            .setScale(8, 1)
            .refreshBody();

        // Player
        this.player = this.physics.add.sprite(height - 150, 150, 'player');
        // this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.playerSpeed = 300;
        this.jumpSpeed = 600;

        this.jumping = false;
        this.newJump = true;

        // Ball
        this.balls = this.physics.add.group({
            key: 'ball',
            repeat: 5,
            // setXY: { x: 12, y: 0, stepX: 70 }
        });

        // this.balls.setAll('outOfBoundsKill', true);
        // this.balls.setAll('checkWorldBounds', true);
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
        // this.player.body.setAllowGravity(false);
        // this.player.body.drag.set(50);
        this.player.setGravity(0, this.gravity);
        // this.balls.gravity.y = this.gravity;
        // this.balls.collideWorldBounds = true;

        // Controls
        this.cursors = this.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.W,
            'down': Phaser.Input.Keyboard.KeyCodes.S,
            'left': Phaser.Input.Keyboard.KeyCodes.A,
            'right': Phaser.Input.Keyboard.KeyCodes.D,
            'jump': Phaser.Input.Keyboard.KeyCodes.SPACE,
            'fire': Phaser.Input.Keyboard.KeyCodes.SHIFT
        });

        // this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.balls, this.platforms);
    },
    update: function() {
        'use strict';

        console.log('[PLAY] update');

        // game.physics.arcade.collide(this.player, this.platforms);
        // game.physics.arcade.collide(this.balls);
        // game.physics.arcade.collide(this.balls, this.platforms);
        // game.physics.arcade.overlap(this.player, this.balls,
        //                             this.grabBall, null, this);
        // game.physics.arcade.overlap(this.balls, this.balls,
        //                             this.separateBalls, null, this);

        this.player.body.setVelocityX(0);

        if (this.cursors.right.isDown) {
            console.log('RIGHT');
            this.player.body.setVelocityX(this.playerSpeed);
            this.ballDirection = 'right';
        }
        else if (this.cursors.left.isDown) {
            console.log('LEFT');
            this.player.body.setVelocityX(-this.playerSpeed);
            this.ballDirection = 'left';
        }
        else if (this.cursors.up.isDown) {
            console.log('UP');
            this.ballDirection = 'up';
        }
        else if (this.cursors.down.isDown) {
            console.log('DOWN');
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
            // this.player.body.velocity.y = -this.jumpSpeed;
            this.player.body.setVelocityY(-this.jumpSpeed);
        }

        if (this.cursors.fire.isDown) {
            this.fire();
        }
    },
    extend: {
        fire: function() {
            'use strict';
            var ball;

            console.log('fire()');

            if (this.time.now > this.ballTime) {
                this.ballTime = this.time.now + this.ballTimeOffset;
                // ball = this.balls.getFirstExists(false);
                ball = this.balls.get();

                if (ball) {
                    ball.body.bounce.set(0.1);
                    ball.body.drag.set(50);
                    // ball.body.setAllowGravity(false);
                    // ball.body.setCircle(8);
                    if (this.ballDirection === 'right' &&
                        !this.player.body.touching.right) {
                        // ball.reset(this.player.x + 32, this.player.y);
                        ball.setPosition(this.player.x + 32, this.player.y);
                        // ball.body.setGravity(0, this.gravity/10);
                        ball.body.setVelocityX(this.ballSpeed);
                        ball.body.setVelocityY(-100);
                    }
                    else if (this.ballDirection === 'left' &&
                             !this.player.body.touching.left) {
                        // ball.reset(this.player.x - 32, this.player.y);
                        ball.setPosition(this.player.x - 32, this.player.y);
                        // ball.body.setGravity(0, this.gravity/10);
                        ball.body.setVelocityX(-this.ballSpeed);
                        ball.body.setVelocityY(-100);
                    }
                    else if (this.ballDirection === 'up' &&
                             !this.player.body.touching.up) {
                        // ball.reset(this.player.x, this.player.y - 32);
                        ball.setPosition(this.player.x, this.player.y - 32);
                        // ball.body.setGravity(0, this.gravity/10);
                        ball.body.setVelocityY(-this.ballSpeed);
                    }
                    else if (this.ballDirection === 'down' &&
                             !this.player.body.touching.down) {
                        // ball.reset(this.player.x, this.player.y + 32);
                        ball.setPosition(this.player.x, this.player.y + 32);
                        // ball.body.setGravity(0, this.gravity/10);
                        ball.body.setVelocityY(this.ballSpeed);
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
            console.log('[PLAY] end');
            game.scene.switch('play', 'end')
        }
        // interact: function() {
        //     'use strict';
        //     console.log('[PLAY] INTERACT');
        // },
        // end: function() {
        //     'use strict';
        //     console.log('[PLAY] end');
        //     game.scene.switch('play', 'end')
        // }
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
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [
        bootScene,
        loadScene,
        titleScene,
        playScene,
        // endScene
    ]
};

game = new Phaser.Game(gameConfig);
game.scene.start('boot', { someData: '...arbitrary data' });
