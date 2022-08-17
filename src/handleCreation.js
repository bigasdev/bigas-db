const prompt = require('../src/handlePrompts.js');
const { ipcRenderer } = require('electron');
const fs = require('fs');

class Obj{
    constructor(id, values = []){
        this.id = id;
        this.values = values;
    }
}

const createLine = (id) => {
    let newElement = document.createElement('span');
    newElement.innerHTML = baseObject(id);
    childs.push(newElement);
    console.log(newElement.childNodes[0].childNodes);
    

    newElement.childNodes[0].childNodes[1].addEventListener('input', ()=>{
        var x = newElement.querySelector('#text').value;
        var id = newElement.querySelector('#id');
        id.textContent = x;
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
  </div>`;
}

const addCollum = (child, type, name, value) => {
    let newElement = document.createElement('span');
    newElement.innerHTML += 
    `<div class="objects">
        <div class="collum">
        <h1 id="name">${name}</h1>
        <p id="type">${type}</p>
        <input id="value" placeholder="${value}"></input>
        </div>
    </div>`;

    child.appendChild(newElement);
}

let mainId;
let childs = [];

window.addEventListener('DOMContentLoaded', ()=>{
    mainId = document.getElementById('main');
    //createLine("001");

    prompt.initialize();
    prompt.components.initializeCollum(()=>{
        console.log(prompt.components.getCollumOption());
        createCollum(childs[childs.length - 1].childNodes[0], prompt.components.getCollumOption(), prompt.components.getCollumName());
    })
    getAllButtons();
})

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
        var promptObj = prompt.components.getCollum();
        promptObj.style.display = 'block';
        promptObj.style.pointerEvents = 'all';
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
    fs.writeFile('testifle.bdata', json, function(err){
        if(err)return console.log(err);
    });
}

ipcRenderer.on('path-message', function(evt, message){
    loadSaved(message.path[0]);
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