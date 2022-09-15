const { ipcRenderer } = require('electron');

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
let hover ={
    x:5,
    y:5
};
let mousePos;
class Interactable{
    constructor(imgPath, img, radius, position, callback){
        this.imgPath = imgPath;
        this.img = img;
        this.radius = radius;
        this.position = position;
        this.callback = callback;
        let hover = false;
    }
}

function isIntersect(point, element){
    var value = point.x > element.position.x && point.x < (element.position.x + element.radius.x) && point.y > element.position.y && point.y < (element.position.y + element.radius.y);
    return value;
}

const drawHover = (x,y, interactable) => {
    if(hover!=null){
        ctx.clearRect(hover.x,hover.y, 44, 32);
        if(hover.x != 5 && hover.y != 5)
            createImageInteractable(interactable.radius.x, interactable.radius.y, interactable.imgPath, hover.x, hover.y);
    }
    var image = new Image(22, 16);
    image.src = '../src/assets/hover.png';
    hover.x = x;
    hover.y = y;
    image.onload = () => ctx.drawImage(image, x, y, 44, 32);
}

ipcRenderer.on('open-file', function(evt, message){
    loadFile(message.path[0]);
})

const loadFile = (file) => {
    console.log(file);;
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
                drawHover(i.position.x, i.position.y, i);
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

    var openFile = document.getElementById('file-selection');
    openFile.addEventListener("click", ()=>{
        console.log('clicking');

        var result = ipcRenderer.invoke('open-file');
    })

    createImage(84, 143, '../src/assets/menus.png', 50, 150, 2);
    createImage(193, 141, '../src/assets/textEditor.png', 236, 155, 2);
    
    setTimeout(()=>{
        //drawMenus();
        addCanvasBinds();
    }, 300);
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
    var i = new Interactable(src, image, {x:width*size, y:height*size}, {x:x, y:y}, ()=>{
        console.log(here);
    })
    interactables[interactables.length + 1] = i;
}

start();