const { ipcRenderer } = require('electron');
const fs = require('fs');

let canvas;
let textArea;
let openFile;
let ctx;

let objectXIncrease = 0;
let objectYIncrease = 0;


const maxRows = 3;

const objects = {
    menus: [
        {
            "name": "items",
            "type": "item",
            "amount": 0,
            "x": 16,
            "y": 215
        },
        {
            "name": "creatures",
            "type": "creature",
            "amount": 0,
            "x" : 16,
            "y" : 338
        }
    ]
}

let json;

const interactables = [];
let hover ={
    x:5,
    y:5
};
let mousePos;
class Interactable{
    constructor(type,at, imgPath, img, radius, position, callback){
        this.type = type;
        this.at = at;
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
            createImageInteractable(interactable.type, interactable.at, interactable.radius.x, interactable.radius.y, interactable.imgPath, hover.x, hover.y);
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
    fs.readFile(file, (err,data)=>{
        if(err)throw err;
        json = JSON.parse(data);
        json[0].Items.forEach(i =>{
            objects.menus[0].amount++;
        })
        json[0].Creatures.forEach(c =>{
            objects.menus[1].amount++;
        })
        var t = document.getElementById('file-selection-text');
        t.innerHTML = json[0].Name;
        textArea.value += json;
        drawMenus();
        console.log(json);
    });
}

const drawMenus = () => {
    objects.menus.forEach(o => {
        var collum = 0;
        for (let i = 0; i < o.amount; i++) {
            objectXIncrease += 46;
            createImageInteractable(o.type, i, 22,16,'../src/assets/field.png', o.x + objectXIncrease, o.y + objectYIncrease, 2);
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
                textArea.value = "";
                drawHover(i.position.x, i.position.y, i);
                if(i.type === "item"){
                    textArea.value += JSON.stringify(json[0].Items[i.at]);
                }else if(i.type === "creature"){
                    textArea.value += JSON.stringify(json[0].Creatures[i.at]);
                }
                
            }
        })
    })
}

function start(){
    canvas = document.getElementById('canvas');
    textArea = document.getElementById('editor');
    console.log(canvas);
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    openFile = document.getElementById('file-selection');
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
const createImageInteractable = (type, at, width, height, src, x,y, size = 1) =>{
    var image = new Image(width,height);
    image.src = src;
    image.onload = () => ctx.drawImage(image, x, y, width*size, height*size);
    var i = new Interactable(type, at, src, image, {x:width*size, y:height*size}, {x:x, y:y}, ()=>{
        console.log(here);
    })
    interactables[interactables.length + 1] = i;
}

start();