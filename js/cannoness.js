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

    },
    update: function() {
        'use strict';

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
