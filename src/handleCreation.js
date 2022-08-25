const prompt = require('../src/handlePrompts.js');
const { ipcRenderer } = require('electron');
const fs = require('fs');
const { error } = require('console');

class Obj{
    constructor(id, values = []){
        this.id = id;
        this.values = values;
    }
}

const createLine = (id) => {
    let newElement = document.createElement('div');
    newElement.className = "span-object";
    newElement.innerHTML = baseObject(id);
    childs.push(newElement);
    console.log(newElement.childNodes);

    var id = childs.length - 1;
    
    newElement.childNodes[0].childNodes[1].addEventListener('input', ()=>{
        var x = newElement.querySelector('#text').value;
        var id = newElement.querySelector('#id');
        id.textContent = x;
    })

    newElement.childNodes[2].addEventListener('click', ()=>{
        currentLine = id;
        openCollumPrompt();
    })

    mainId.appendChild(newElement);
}

const removeLine = () => {
    if(childs.length == 0)return;
    let line = childs.pop();
    mainId.removeChild(line);
}

const createCollum = (child, type, name, value) => {
    addCollum(child, type, name, value);
}

const baseObject = (id) =>{
    return `<div class="base-object">
        <div class="default-collum">
        <p id="id">${id}</p>
        <div class="text-area">
            <input type="text" id="text">
        </div>
        </div>
    </div>
    <div class="create-collum">
        <button class="collum-button">➕ Add collum</button>
    </div>`;
}

const addCollum = (child, type, name, value) => {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + internalCounter;

    let newElement = document.createElement('span');
    newElement.dataset
    newElement.innerHTML += 
    `<div class="objects">
        <div class="collum" id='${name+time}'">
        <p class="delete" onclick="getCollum('${name+time}')">❌</p>
        <h1 id="name">${name}</h1>
        <p id="type">${type}</p>
        <input id="value" placeholder="${value}" value="${value}"></input>
        </div>
    </div>`;

    child.appendChild(newElement);
    internalCounter++;
}

let mainId;
let childs = [];
let internalCounter = 0;
let currentPath = '';
let currentLine = 0;

window.addEventListener('DOMContentLoaded', ()=>{
    mainId = document.getElementById('main');
    //createLine("001");

    prompt.initialize();
    prompt.components.initializeCollum(()=>{
        console.log(prompt.components.getCollumOption());
        createCollum(childs[currentLine].childNodes[0], prompt.components.getCollumOption(), prompt.components.getCollumName());
    })
    getAllButtons();
    readLocal();
    console.log(currentPath);
})

function openCollumPrompt(){
    var promptObj = prompt.components.getCollum();
    promptObj.style.display = 'block';
    promptObj.style.pointerEvents = 'all';
}

function getAllButtons(){
    let createLineObj = document.getElementById('create-line');
    createLineObj?.addEventListener('click', ()=>{
        createLine('001');
    })

    let removeLineObj = document.getElementById('remove-line');
    removeLineObj?.addEventListener('click', ()=>{
        removeLine();
    })

    let createCollumObj = document.getElementById('create-collum');
    createCollumObj?.addEventListener('click', ()=>{
        openCollumPrompt();
        //createCollum(childs[childs.length - 1].childNodes[0]);
    })

    let saveFileObj = document.getElementById('save-file');
    saveFileObj?.addEventListener('click', ()=>{
        saveFile();
    })

    let reloadObj = document.getElementById('reload');
    reloadObj?.addEventListener('click', ()=>{
        loadSaved();
    })
}

function saveFile(){
    var objs = [];
    childs.forEach(element =>{
        var spans = element.querySelectorAll('span');
        var id = element.querySelector('#id');
        var o = new Obj(id.innerHTML);
        
        spans.forEach(span =>{
            var nameValue = span.querySelector('#name');
            if(nameValue === undefined || nameValue === null)return;
            var typeValue = span.querySelector('#type');
            var valueValue = span.querySelector('#value');
            console.log(nameValue.innerHTML+typeValue.innerHTML+valueValue.value);
            var spanObj = {name:nameValue.innerHTML, type:typeValue.innerHTML,value:valueValue.value};
            
            o.values.push(spanObj);
        })

        objs.push(o);

        /*obj += '{';
        s.forEach(val => {
            obj += `type:${val},
            value: ${val.value},`;
        })
        obj += '} ';*/
    })
    var json = JSON.stringify(objs);
    console.log(json);
    console.log(currentPath);
    if(currentPath === ''){
        currentPath = "./file.bdata";
    }
    fs.writeFile(currentPath, json, function(err){
        if(err)return console.log(err);
    });
}

ipcRenderer.on('path-message', function(evt, message){
    loadSaved(message.path[0]);
    saveLocal(message.path[0]);
})

ipcRenderer.on('save-file', function(evt,message){
    saveFile();
})

function loadSaved(path){;
    console.log(path);
    fs.readFile(path, (err,data)=>{
        if(err)throw err;
        let json = JSON.parse(data);
        console.log(json);
        console.log(json[0].id);
        json.forEach(j =>{
            createLine(j.id);
            j.values.forEach(val =>{
                createCollum(childs[childs.length - 1].childNodes[0], val.type, val.name, val.value);
            })
        })
    })
}
function getCollum(collum){
    var e = document.getElementById(collum);
    e.remove();
    //e.style.display = 'none';
    //collum.style.display = 'none';
    console.log(e);
}

function saveLocal(path){
    fs.writeFile('settings.txt', path, function(err){
        if(err)return console.log(err);
    });
}

function readLocal(){
    fs.readFile('./settings.txt', 'utf8', (err, data)=>{
        if(err){
            fs.writeFile('settings.txt', process.cwd()+'/file.bdata', function(err){
                if(err)throw err;
            })
            createLine('001');
            throw err;
        }
        console.log(data);  
        currentPath = data;
        loadSaved(data);
        return data;
    })
    
}