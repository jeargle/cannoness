var score, bootState, loadState, titleState, playState, endState, game;

score = 0;

bootState = {
    create: function() {
        'use strict';

        // Load physics engine
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.state.start('load');
    }
};

loadState = {
    preload: function() {
        'use strict';
        var loadLbl;

        loadLbl = game.add.text(80, 160, 'loading...',
                                {font: '30px Courier',
                                 fill: '#ffffff'});
        
        // Load images
        game.load.image('player', 'assets/square-red.png');
        game.load.image('enemy', 'assets/square-blue.png');
        game.load.image('platform', 'assets/square-green.png');
        game.load.image('ball', 'assets/ball.png');

        // Load sound effects
    },
    create: function() {
        'use strict';
        game.state.start('title');
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
        var block;

        this.keyboard = game.input.keyboard;

        game.physics.startSystem(Phaser.Physics.ARCADE);


        // Platforms
        this.platforms = game.add.group();
        this.platforms.enableBody = true;

        // Ground
        block = this.platforms.create(0, game.world.height - 32, 'platform');
        block.scale.setTo(25, 1);
        block.body.immovable = true;

        block = this.platforms.create(0, 0, 'platform');
        block.scale.setTo(25, 1);
        block.body.immovable = true;

        // Walls
        block = this.platforms.create(0, 32, 'platform');
        block.scale.setTo(1, 17);
        block.body.immovable = true;
        
        block = this.platforms.create(game.world.width - 32, 32, 'platform');
        block.scale.setTo(1, 17);
        block.body.immovable = true;

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
        this.player = game.add.sprite(32, game.world.height - 150, 'player');
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

        this.ballSpeed = 1200;
        this.ballTime = 0;
        this.ballTimeOffset = 300;
        this.ballDirection = 'right';
        
        // Gravity
        this.gravity = 2000;
        this.player.body.gravity.y = this.gravity;
        this.player.body.collideWorldBounds = true;
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
        game.physics.arcade.collide(this.balls, this.balls);
        game.physics.arcade.collide(this.balls, this.platforms);
        game.physics.arcade.overlap(this.player, this.balls,
                                    this.grabBall, null, this);
        
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

        if (game.time.now > this.ballTime) {
            this.ballTime = game.time.now + this.ballTimeOffset;
            ball = this.balls.getFirstExists(false);

            if (ball) {
                if (this.ballDirection === 'right' &&
                    !this.player.body.touching.right) {
                    ball.reset(this.player.x + 16, this.player.y);
                    ball.body.velocity.x = this.ballSpeed;
                    ball.body.velocity.y = -100;
                    ball.body.gravity.y = this.gravity;
                }
                else if (this.ballDirection === 'left' &&
                         !this.player.body.touching.left) {
                    ball.reset(this.player.x - 16, this.player.y);
                    ball.body.velocity.x = -this.ballSpeed;
                    ball.body.velocity.y = -100;
                    ball.body.gravity.y = this.gravity;
                }
                else if (this.ballDirection === 'up' &&
                         !this.player.body.touching.up) {
                    ball.reset(this.player.x, this.player.y - 16);
                    ball.body.velocity.y = -this.ballSpeed;
                    ball.body.gravity.y = this.gravity;
                }
                else if (this.ballDirection === 'down' &&
                         !this.player.body.touching.down) {
                    ball.reset(this.player.x, this.player.y + 16);
                    ball.body.velocity.y = this.ballSpeed;
                    ball.body.gravity.y = this.gravity;
                }
            }
        }
    },
    grabBall: function(player, ball) {
        'use strict';

        ball.kill();
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


game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-div');

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('title', titleState);
game.state.add('play', playState);
game.state.add('end', endState);

game.state.start('boot');
