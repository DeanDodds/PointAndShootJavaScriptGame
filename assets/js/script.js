const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCanvasCtx = collisionCanvas.getContext('2d' ,{ willReadFrequently: true });
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

ctx.font = '50px Impact'

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;

let score = 0;


let ravens = [];
class Raven {
    constructor(){
    this.spriteWidth = 270;
    this.spriteHeight = 194;
    this.sizeModifier = Math.random() * 0.6 + 0.4
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);
    this.directionX = Math.random() * 5 + 3;
    this.directionY = Math.random() * 5 - 2.5;
    this.markedForDeletion = false;
    this.image = new Image();
    this.image.src = "./assets/images/raven.png";
    this.frame = 0;
    this.maxFrame = 4;
    this.timeSinceFlap = 0;
    this.flapInterval = Math.random() * 50 + 50;
    this.randomColor = [Math.floor(Math.random() * 255),Math.floor(Math.random() * 255),Math.floor(Math.random() * 255)]
    this.color = 'rgb(' + this.randomColor[0] + ',' + this.randomColor[1] + ',' + this.randomColor[2] + ')';
    }
    update(deltaTime){
        if(this.y < 0 || this.y > canvas.height - this.height ){
            this.directionY = this.directionY * -1;
        }
        this.x -= this.directionX;
        this.y += this.directionY;
        if(this.x < 0 - this.width ) this.markedForDeletion = true;

        this.timeSinceFlap += deltaTime;
        if(this.timeSinceFlap > this.flapInterval){
            if(this.frame > this.maxFrame) this.frame = 0;
            else this.frame++;
            this.timeSinceFlap = 0;
        }
    }   
    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
        collisionCanvasCtx.fillStyle = this.color;
        collisionCanvasCtx.fillRect(this.x, this.y, this.width, this.height)
    }
}

function drawScore(){
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 50, 75)
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 53, 78)
}

window.addEventListener('click', function(e){
    const detectColor = collisionCanvasCtx.getImageData(e.x, e.y, 1, 1)
    const pc = detectColor.data;
    console.log(pc)
    ravens.forEach(object => {
        if(object.randomColor[0] === pc[0] && object.randomColor[0] === pc[0] && object.randomColor[0] === pc[0]) {
            object.markedForDeletion = true;
            console.log(object.color + object.markedForDeletion)
            score++
           }
        })
    })

function animate(timestamp){
    collisionCanvasCtx.clearRect(0,0,collisionCanvas.width,collisionCanvas.height);
    ctx.clearRect(0,0,canvas.width, canvas.height)
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextRaven += deltaTime
    if(timeToNextRaven > ravenInterval){
        ravens.push(new Raven);
        timeToNextRaven = 0;
        ravens.sort(function(a,b){
            return a.width = b.width;
        })
    }
    [...ravens].forEach(object => object.update(deltaTime));
    [...ravens].forEach(object => object.draw());
    ravens = ravens.filter(object => !object.markedForDeletion);
    drawScore();
    requestAnimationFrame(animate)
}
animate(0);


