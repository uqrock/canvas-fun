import utils from './utils'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2,
}

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']

// Event Listeners
addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight

    init()
})

// Objects
function Star(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = {
        x: utils.randomIntFromRange(-4, 4),
        y: 3,
    }

    this.friction = 0.8
    this.gravity = 1
}

Star.prototype = {
    draw: function() {
        c.save()
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.shadowColor = '#E3EAEF'
        c.shadowBlur = 20
        c.fill()
        c.closePath()
        c.restore()
    },
    update: function() {
        this.draw()

        // when ball hits bottom of screen
        if (this.y + this.radius + this.velocity.y > canvas.height) {
            this.velocity.y = -this.velocity.y * this.friction
            this.shater()
        } else {
            this.velocity.y += this.gravity
        }

        this.x += this.velocity.x
        this.y += this.velocity.y
    },
    shater: function() {
        this.radius -= 3
        for (var i = 0; i < 8; i++) {
            miniStars.push(new MiniStar(this.x, this.y, 2))
        }
    },
}

function MiniStar(x, y, radius, color) {
    Star.call(this, x, y, radius, color)
    this.velocity = {
        x: utils.randomIntFromRange(-5, 5),
        y: utils.randomIntFromRange(-15, 15),
    }

    this.friction = 0.8
    this.gravity = 0.1
    this.ttl = 300
    this.opacity = 1
}

MiniStar.prototype = {
    draw: function() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = `rgba(227, 234, 239, ${this.opacity})`
        c.fill()
        c.closePath()
        c.restore()
    },
    update: function() {
        this.draw()

        // when ball hits bottom of screen
        if (this.y + this.radius + this.velocity.y > canvas.height) {
            this.velocity.y = -this.velocity.y * this.friction
        } else {
            this.velocity.y += this.gravity
        }

        this.x += this.velocity.x
        this.y += this.velocity.y
        this.ttl -= 1
        this.opacity -= 1 / this.ttl
    },
}

// Implementation
const backgroundGradient = c.createLinearGradient(0, 0, 0, canvas.height)
backgroundGradient.addColorStop(0, '#171e26')
backgroundGradient.addColorStop(1, '#3f586b')

let stars
let miniStars
let backgroundStars
let ticker = 0
let randomSpawnRate = 75;

function init() {
    stars = []
    miniStars = []
    backgroundStars = []

    for (var i = 0; i < 150; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const radius = Math.random() * 3
        backgroundStars.push(new Star(x, y, radius, 'white'))
    }
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = backgroundGradient
    c.fillRect(0, 0, canvas.width, canvas.height)

    stars.forEach((star, index) => {
        star.update()
        if (star.radius === 0) {
            stars.splice(index, 1)
        }
    })

    miniStars.forEach((miniStar, index) => {
        miniStar.update()
        if (miniStar.ttl === 0) {
            miniStars.splice(index, 1)
        }
    })

    backgroundStars.forEach(backgroundStar => {
        backgroundStar.draw()
    })

    ticker++

    if (ticker % randomSpawnRate === 0) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.width;

        stars.push(new Star(x, -100, 12, 'white'))
        randomSpawnRate = utils.randomIntFromRange(75, 200)
    }
}

init()
animate()
