let canvas;
let ctx;

let objectXIncrease = 0;
let objectYIncrease = 0;

const maxRows = 3;

const objects = {
    menus: [
        {
            "name": "items",
            "amount": 5,
            "x": 16,
            "y": 215
        },
        {
            "name": "creatures",
            "amount": 5,
            "x" : 16,
            "y" : 338
        }
    ]
}

const interactables = [];
class Interactable{
    constructor(img, radius, position, callback){
        this.img = img;
        this.radius = radius;
        this.position = position;
        this.callback = callback;
        let hover = false;
    }
}

const drawMenus = () => {
    objects.menus.forEach(o => {
        var collum = 0;
        for (let i = 0; i < o.amount; i++) {
            objectXIncrease += 46;
            createImage(22,16,'../src/assets/field.png', o.x + objectXIncrease, o.y + objectYIncrease, 2);
            collum++;
            if(collum >= maxRows){
                objectXIncrease = 0;
                objectYIncrease += 34;
                collum = 0;
            }
        }
        objectXIncrease = 0;
        objectYIncrease = 0;
    })
}

function start(){
    canvas = document.getElementById('canvas');
    console.log(canvas);
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    createImage(84, 143, '../src/assets/menus.png', 50, 150, 2);
    
    drawMenus();
}

const createImage = (width, height, src, x,y, size = 1) =>{
    var image = new Image(width,height);
    image.src = src;
    image.onload = () => ctx.drawImage(image, x, y, width*size, height*size);
    var i = new Interactable(image, 22, [x,y], ()=>{
        console.log(here);
    })
    interactables[interactables.length + 1] = i;
}

start();