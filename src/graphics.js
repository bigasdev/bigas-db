let canvas;
let ctx;

function start(){
    canvas = document.getElementById('canvas');
    console.log(canvas);
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    createImage(84, 143, '../src/assets/menus.png', 50, 150, 2);
    createImage(22,16, '../src/assets/field.png', 50, 250,2);
}

const createImage = (width, height, src, x,y, size = 1) =>{
    var image = new Image(width,height);
    image.src = src;
    image.onload = () => ctx.drawImage(image, x, y, width*size, height*size);
}

start();