const prompt = require('../src/handlePrompts.js');
const fs = require('fs');

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

const createCollum = (child, type) => {
    addCollum(child, type);
}

const baseObject = (id) =>{
    return `<div class="base-object">
    <div class="default-collum">
      <span id="id">${id}</span>
      <div class="text-area">
        <input type="text" id="text">
      </div>
    </div>
  </div>`;
}

const addCollum = (child, type) => {
    let newElement = document.createElement('span');
    newElement.innerHTML += 
    `<div class="objects">
        <div class="collum">
        <span>${type}</span>
        <input id="value"></input>
        </div>
    </div>`;

    child.appendChild(newElement);
}

let mainId;
let childs = [];

window.addEventListener('DOMContentLoaded', ()=>{
    mainId = document.getElementById('main');
    createLine("001");

    prompt.initialize();
    prompt.components.initializeCollum(()=>{
        console.log(prompt.components.getCollumOption());
        createCollum(childs[childs.length - 1].childNodes[0], prompt.components.getCollumOption());
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
}

function saveFile(){
    var obj = '';
    childs.forEach(element =>{
        var s = element.querySelectorAll('#value');
        obj += '{';
        s.forEach(val => {
            obj += `value: ${val.value},`;
        })
        obj += '} ';
    })
    var json = JSON.stringify(obj);
    console.log(json);
    fs.writeFile('testifle.bdata', json, function(err){
        if(err)return console.log(err);
    });
}