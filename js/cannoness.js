let score, game

score = 0


class BootScene extends Phaser.Scene {
    constructor() {
        super('boot')
    }

    init(config) {
        console.log('[BOOT] init', config)
    }

    preload() {
        console.log('[BOOT] preload')
    }

    create() {
        game.scene.start('load')
        game.scene.remove('boot')
    }

    update() {
        console.log('[BOOT] update')
    }
}


class LoadScene extends Phaser.Scene {
    constructor() {
        super('load')
    }

    init(config) {
        console.log('[LOAD] init', config)
    }

    preload() {
        this.add.text(80, 160, 'loading...',
                      {font: '30px Courier',
                       fill: '#ffffff'})

        // Load images
        this.load.image('player', 'assets/square-red.png')
        this.load.image('enemy', 'assets/square-blue.png')
        this.load.image('platform', 'assets/square-green.png')
        this.load.image('ball', 'assets/ball.png')

        // Load sound effects
    }

    create() {
        game.scene.start('title')
        game.scene.remove('load')
    }

    update() {
        console.log('[LOAD] update')
    }
}


class TitleScene extends Phaser.Scene {
    constructor() {
        super('title')
    }

    init(config) {
        console.log('[TITLE] init', config)
    }

    preload() {
        console.log('[TITLE] preload')
    }

    create() {
       this.add.text(80, 160, 'CANNONESS',
                     {font: '50px Courier',
                      fill: '#ffffff'})
        this.add.text(80, 240, 'press "W" to start',
                      {font: '30px Courier',
                       fill: '#ffffff'})

        this.input.keyboard.on('keydown_W', this.start, this)
    }

    update() {
        console.log('[TITLE] update')
    }

    start() {
        console.log('[TITLE] start')
        game.scene.switch('title', 'play')
    }
}


class PlayScene extends Phaser.Scene {
    constructor() {
        super('play')
    }

    create() {
        console.log('[PLAY] create')

        // Platforms
        this.platforms = this.physics.add.staticGroup()

        let height = 600
        let width = 800

        // Ground
        let block = this.platforms.create(0, height - 32, 'platform')
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

        let balls = this.balls
        let i = 0
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
    }

    update() {
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
    }

    fire() {
        console.log('fire()')

        if (this.time.now > this.ballTime) {
            this.ballTime = this.time.now + this.ballTimeOffset
            let ball = this.balls.getFirstDead()

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
    }

    grabBall(player, ball) {
        this.balls.killAndHide(ball)
        ball.setPosition(ball.index * 50, -50)
    }

    checkBalls(ball1, ball2) {
        console.log('[PLAY] checkBalls')
        console.log(ball1.x + ' ' + ball2.x)
        if (Math.abs(ball1.y - ball2.y) < 16 &&
            Phaser.Math.Distance.Between(ball1.x, ball1.y, ball2.x, ball2.y) < 16) {
            return true
        }

        return false
    }

    separateBalls(ball1, ball2) {
        // console.log('[PLAY] separateBalls')
        // console.log(ball1.x + ' ' + ball2.x)

        let overlapDist = 16 - Math.abs(ball1.x - ball2.x)
        let force = overlapDist + 16

        if (ball1.x <= ball2.x) {
            ball1.body.setVelocityX(-force)
            ball2.body.setVelocityX(force)
        }
        else {
            ball1.body.setVelocityX(force)
            ball2.body.setVelocityX(-force)
        }
    }

    end() {
        console.log('[PLAY] end')
        game.scene.switch('play', 'end')
    }
}


class EndScene extends Phaser.Scene {
    constructor() {
        super('end')
    }

    create() {
        this.add.text(600, 10, 'Score: ' + score,
                      {font: '30px Courier',
                       fill: '#ffffff'})
        this.add.text(80, 160, 'YOU DIED',
                      {font: '50px Courier',
                       fill: '#ffffff'})
        this.add.text(80, 240, 'press "W" to restart',
                      {font: '30px Courier',
                       fill: '#ffffff'})

        this.input.keyboard.on('keydown_W', this.restart, this)
    }

    restart() {
        game.scene.switch('end', 'title')
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
        BootScene,
        LoadScene,
        TitleScene,
        PlayScene,
        EndScene
    ]
}

game = new Phaser.Game(gameConfig)
game.scene.start('boot', { someData: '...arbitrary data' })
