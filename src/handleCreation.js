
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

const createCollum = (child) => {
    addCollum(child);
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
        <span>Title!</span>
        </div>
    </div>`;

    child.appendChild(newElement);
}

let mainId;
let childs = [];

window.addEventListener('DOMContentLoaded', ()=>{
    mainId = document.getElementById('main');
    createLine("001");

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
        createCollum(childs[childs.length - 1].childNodes[0]);
    })
}