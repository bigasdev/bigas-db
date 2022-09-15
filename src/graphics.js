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
let hover;
let mousePos;
class Interactable{
    constructor(img, radius, position, callback){
        this.img = img;
        this.radius = radius;
        this.position = position;
        this.callback = callback;
        let hover = false;
    }
}

function isIntersect(point, element){
    var value = Math.sqrt(point.x-element.position.x) < element.radius && Math.sqrt(point.y-element.position.y) < element.radius;
    return value;
}

const drawMenus = () => {
    objects.menus.forEach(o => {
        var collum = 0;
        for (let i = 0; i < o.amount; i++) {
            objectXIncrease += 46;
            createImageInteractable(22,16,'../src/assets/field.png', o.x + objectXIncrease, o.y + objectYIncrease, 2);
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

function addCanvasBinds(){
    canvas.addEventListener("mousemove", (e)=>{
        var pos = {
            x: e.offsetX,
            y: e.offsetY
        };
        mousePos = pos;
        interactables.forEach(i =>{
            if(isIntersect(mousePos, i)){
                i.hover = true;
                
            }else{
                
            }
        })
    })
    canvas.addEventListener("click", (e)=>{
        interactables.forEach(i =>{
            if(isIntersect(mousePos, i)){
                hover.x = i.x;
                hover.y = i.y;
                console.log('clicked on this obj!')
            }
        })
    })
}

function start(){
    canvas = document.getElementById('canvas');
    console.log(canvas);
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    createImage(84, 143, '../src/assets/menus.png', 50, 150, 2);
    hover = createImage(22,16, '../src/assets/hover.png', 50, 1250, 2);
    
    drawMenus();
    addCanvasBinds();
}

const createImage = (width, height, src, x,y, size = 1) =>{
    var image = new Image(width,height);
    image.src = src;
    image.onload = () => ctx.drawImage(image, x, y, width*size, height*size);
    return image;
}
const createImageInteractable = (width, height, src, x,y, size = 1) =>{
    var image = new Image(width,height);
    image.src = src;
    image.onload = () => ctx.drawImage(image, x, y, width*size, height*size);
    var i = new Interactable(image, 8, {x:x, y:y}, ()=>{
        console.log(here);
    })
    interactables[interactables.length + 1] = i;
}

start();