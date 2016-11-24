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

        // Gravity
        this.gravity = 2000;
        this.player.body.gravity.y = this.gravity;
        this.player.body.collideWorldBounds = true;

        // Controls
        this.cursors = game.input.keyboard.addKeys({
            'up': Phaser.Keyboard.W,
            'down': Phaser.Keyboard.S,
            'left': Phaser.Keyboard.A,
            'right': Phaser.Keyboard.D,
            'jump': Phaser.Keyboard.SPACEBAR
        });

    },
    update: function() {
        'use strict';

        game.physics.arcade.collide(this.player, this.platforms);
        game.physics.arcade.collide(this.stars, this.platforms);
        
        this.player.body.velocity.x = 0;
        if (this.cursors.right.isDown) {
            this.player.body.velocity.x = this.playerSpeed;
        }
        else if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -this.playerSpeed;
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
