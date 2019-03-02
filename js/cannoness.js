var score, game

score = 0


const bootScene = {
    key: 'boot',
    active: true,
    init: (config) => {
        console.log('[BOOT] init', config)
    },
    preload: () => {
        console.log('[BOOT] preload')
    },
    create: function() {
        'use strict'

        game.scene.start('load')
        game.scene.remove('boot')
    },
    update: () => {
        console.log('[BOOT] update')
    }
}


const loadScene = {
    key: 'load',
    renderToTexture: true,
    x: 64,
    y: 64,
    width: 320,
    height: 200,
    init: (config) => {
        console.log('[LOAD] init', config)
    },
    preload: function() {
        'use strict'
        var loadLbl

        loadLbl = this.add.text(80, 160, 'loading...',
                                {font: '30px Courier',
                                 fill: '#ffffff'})

        // Load images
        this.load.image('player', 'assets/square-red.png')
        this.load.image('enemy', 'assets/square-blue.png')
        this.load.image('platform', 'assets/square-green.png')
        this.load.image('ball', 'assets/ball.png')

        // Load sound effects
    },
    create: function() {
        'use strict'
        game.scene.start('title')
        game.scene.remove('load')
    },
    update: () => {
        console.log('[LOAD] update')
    }
}


const titleScene = {
    key: 'title',
    init: (config) => {
        console.log('[TITLE] init', config)
    },
    preload: () => {
        console.log('[TITLE] preload')
    },
    create: function() {
        'use strict'
        var nameLbl, startLbl

        nameLbl = this.add.text(80, 160, 'CANNONESS',
                                {font: '50px Courier',
                                 fill: '#ffffff'})
        startLbl = this.add.text(80, 240, 'press "W" to start',
                                 {font: '30px Courier',
                                  fill: '#ffffff'})

        this.input.keyboard.on('keydown_W', this.start, this)
    },
    update: () => {
        console.log('[TITLE] update')
    },
    extend: {
        start: function() {
            'use strict'
            console.log('[TITLE] start')
            game.scene.switch('title', 'play')
        }
    }
}


const playScene = {
    key: 'play',
    create: function() {
        'use strict'
        var height, width, block, i, balls, ball

        console.log('[PLAY] create')

        // Platforms
        this.platforms = this.physics.add.staticGroup()

        height = 600
        width = 800

        // Ground
        block = this.platforms.create(0, height - 32, 'platform')
            .setOrigin(0, 0)
            .setScale(25, 1)
            .refreshBody()

        block = this.platforms.create(0, 0, 'platform')
            .setOrigin(0, 0)
            .setScale(25, 1)
            .refreshBody()


        // Walls
        block = this.platforms.create(0, 32, 'platform')
            .setOrigin(0, 0)
            .setScale(1, 17)
            .refreshBody()

        block = this.platforms.create(width - 32, 32, 'platform')
            .setOrigin(0, 0)
            .setScale(1, 17)
            .refreshBody()

        // Ledges
        block = this.platforms.create(0, 250, 'platform')
            .setOrigin(0, 0)
            .setScale(8, 1)
            .refreshBody()

        block = this.platforms.create(100, 275, 'platform')
            .setOrigin(0, 0)
            .setScale(8, 1)
            .refreshBody()

        block = this.platforms.create(200, 350, 'platform')
            .setOrigin(0, 0)
            .setScale(8, 1)
            .refreshBody()

        block = this.platforms.create(300, 425, 'platform')
            .setOrigin(0, 0)
            .setScale(8, 1)
            .refreshBody()

        block = this.platforms.create(400, 500, 'platform')
            .setOrigin(0, 0)
            .setScale(8, 1)
            .refreshBody()

        // Player
        this.player = this.physics.add.sprite(height - 150, 150, 'player')
        // this.player.setBounce(0.2)
        this.player.setCollideWorldBounds(true)

        this.playerSpeed = 300
        this.jumpSpeed = 600

        this.jumping = false
        this.newJump = true

        // Ball
        this.balls = this.physics.add.group({
            key: 'ball',
            active: false,
            repeat: 5,
            setXY: { x: 0, y: -50, stepX: 50 }
        })

        balls = this.balls
        i = 0
        balls.children.iterate(function(ball) {
            // ball.body.setCircle(16)
            ball.index = i
            i++
            balls.killAndHide(ball)
        })

        // this.balls.setAll('outOfBoundsKill', true)
        // this.balls.setAll('checkWorldBounds', true)
        // this.balls.setAll('bounce', 1)
        // for (i=0; i<5; i++) {
        //     ball = this.balls.create('ball')
        //     ball.anchor.setTo(0.5, 0.5)
        //     ball.body.bounce.set(1)
        // }

        this.ballSpeed = 400
        this.ballTime = 0
        this.ballTimeOffset = 300
        this.ballDirection = 'right'

        // Gravity
        this.gravity = 2000
        this.player.setGravity(0, this.gravity)

        // Controls
        this.cursors = this.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.W,
            'down': Phaser.Input.Keyboard.KeyCodes.S,
            'left': Phaser.Input.Keyboard.KeyCodes.A,
            'right': Phaser.Input.Keyboard.KeyCodes.D,
            'jump': Phaser.Input.Keyboard.KeyCodes.SPACE,
            'fire': Phaser.Input.Keyboard.KeyCodes.SHIFT
        })

        this.physics.add.collider(this.player, this.platforms)
        this.physics.add.collider(this.balls, this.platforms)
        this.physics.add.collider(this.balls)
        this.physics.add.overlap(this.player, this.balls,
                                 this.grabBall, null, this)
        // this.physics.add.overlap(this.balls, this.balls,
        //                          this.separateBalls, this.checkBalls, this)
        this.physics.add.overlap(this.balls, this.balls,
                                 this.separateBalls, null, this)
    },
    update: function() {
        'use strict'

        console.log('[PLAY] update')

        this.player.body.setVelocityX(0)

        if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(this.playerSpeed)
            if (this.cursors.up.isDown) {
                console.log('UP-RIGHT')
                this.ballDirection = 'up-right'
            }
            else if (this.cursors.down.isDown) {
                console.log('DOWN-RIGHT')
                this.ballDirection = 'down-right'
            }
            else {
                console.log('RIGHT')
                this.ballDirection = 'right'
            }
        }
        else if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-this.playerSpeed)
            if (this.cursors.up.isDown) {
                console.log('UP-LEFT')
                this.ballDirection = 'up-left'
            }
            else if (this.cursors.down.isDown) {
                console.log('DOWN-LEFT')
                this.ballDirection = 'down-left'
            }
            else {
                console.log('LEFT')
                this.ballDirection = 'left'
            }
        }
        else if (this.cursors.up.isDown) {
            console.log('UP')
            this.ballDirection = 'up'
        }
        else if (this.cursors.down.isDown) {
            console.log('DOWN')
            this.ballDirection = 'down'
        }

        if (this.player.body.touching.down) {
            this.jumping = false
            if (!this.cursors.jump.isDown) {
                this.newJump = true
            }
        }
        else {
            this.jumping = true
            this.newJump = false
        }

        if (this.cursors.jump.isDown &&
            !this.jumping && this.newJump) {
            this.jumping = true
            this.newJump = false
            this.player.body.setVelocityY(-this.jumpSpeed)
        }

        if (this.cursors.fire.isDown) {
            this.fire()
        }
    },
    extend: {
        fire: function() {
            'use strict'
            var ball

            console.log('fire()')

            if (this.time.now > this.ballTime) {
                this.ballTime = this.time.now + this.ballTimeOffset
                ball = this.balls.getFirstDead()

                if (ball) {
                    ball.active = true
                    ball.visible = true
                    ball.body.bounce.set(0.1)
                    ball.body.drag.set(50)
                    if (this.ballDirection === 'right' &&
                        !this.player.body.touching.right) {
                        ball.setPosition(this.player.x + 32, this.player.y)
                        ball.body.setVelocityX(this.ballSpeed)
                        ball.body.setVelocityY(-100)
                    }
                    else if (this.ballDirection === 'left' &&
                             !this.player.body.touching.left) {
                        ball.setPosition(this.player.x - 32, this.player.y)
                        ball.body.setVelocityX(-this.ballSpeed)
                        ball.body.setVelocityY(-100)
                    }
                    else if (this.ballDirection === 'up' &&
                             !this.player.body.touching.up) {
                        ball.setPosition(this.player.x, this.player.y - 32)
                        ball.body.setVelocityY(-this.ballSpeed)
                    }
                    else if (this.ballDirection === 'up-right' &&
                             !this.player.body.touching.up &&
                             !this.player.body.touching.right) {
                        ball.setPosition(this.player.x + 32, this.player.y - 32)
                        this.physics.velocityFromAngle(-45, this.ballSpeed, ball.body.velocity)
                    }
                    else if (this.ballDirection === 'up-left' &&
                             !this.player.body.touching.up &&
                             !this.player.body.touching.left) {
                        ball.setPosition(this.player.x - 32, this.player.y - 32)
                        this.physics.velocityFromAngle(-135, this.ballSpeed, ball.body.velocity)
                    }
                    else if (this.ballDirection === 'down' &&
                             !this.player.body.touching.down) {
                        ball.setPosition(this.player.x, this.player.y + 32)
                        ball.body.setVelocityY(this.ballSpeed)
                    }
                    else if (this.ballDirection === 'down-right' &&
                             !this.player.body.touching.down &&
                             !this.player.body.touching.right) {
                        ball.setPosition(this.player.x + 32, this.player.y + 32)
                        this.physics.velocityFromAngle(45, this.ballSpeed, ball.body.velocity)
                    }
                    else if (this.ballDirection === 'down-left' &&
                             !this.player.body.touching.down &&
                             !this.player.body.touching.left) {
                        ball.setPosition(this.player.x - 32, this.player.y + 32)
                        this.physics.velocityFromAngle(135, this.ballSpeed, ball.body.velocity)
                    }
                }
                else {
                    console.log('no ball available')
                }
            }
        },
        grabBall: function(player, ball) {
            'use strict'

            this.balls.killAndHide(ball)
            ball.setPosition(ball.index * 50, -50)
        },
        checkBalls: function(ball1, ball2) {
            'use strict'
            console.log('[PLAY] checkBalls')
            console.log(ball1.x + ' ' + ball2.x)
            if (Math.abs(ball1.y - ball2.y) < 16 &&
                Phaser.Math.Distance.Between(ball1.x, ball1.y, ball2.x, ball2.y) < 16) {
                return true
            }

            return false
        },
        separateBalls: function(ball1, ball2) {
            'use strict'
            var overlapDist, force
            console.log('[PLAY] separateBalls')
            console.log(ball1.x + ' ' + ball2.x)
            overlapDist = 16 - Math.abs(ball1.x - ball2.x)
            force = overlapDist + 16
            if (ball1.x <= ball2.x) {
                ball1.body.setVelocityX(-force)
                ball2.body.setVelocityX(force)
            }
            else {
                ball1.body.setVelocityX(force)
                ball2.body.setVelocityX(-force)
            }
        },
        end: function() {
            'use strict'
            console.log('[PLAY] end')
            game.scene.switch('play', 'end')
        }
    }
}


const endScene = {
    key: 'end',
    create: function() {
        'use strict'
        var scoreLbl, nameLbl, startLbl

        scoreLbl = this.add.text(600, 10, 'Score: ' + score,
                                 {font: '30px Courier',
                                  fill: '#ffffff'})
        nameLbl = this.add.text(80, 160, 'YOU DIED',
                                {font: '50px Courier',
                                 fill: '#ffffff'})
        startLbl = this.add.text(80, 240, 'press "W" to restart',
                                 {font: '30px Courier',
                                  fill: '#ffffff'})

        this.input.keyboard.on('keydown_W', this.restart, this)
    },
    extend: {
        restart: function() {
            'use strict'
            game.scene.switch('end', 'title')
        }
    }
}


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
        endScene
    ]
}

game = new Phaser.Game(gameConfig)
game.scene.start('boot', { someData: '...arbitrary data' })
