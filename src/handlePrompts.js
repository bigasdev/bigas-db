function initialize(){
    collumPrompt = document.getElementById('collum-prompt');
    console.log(collumPrompt);
}

let collumPrompt;

var components = {
    getCollum:function(){
        collumPrompt.querySelector('#back').addEventListener('click', ()=>{
            collumPrompt.style.display = 'none';
            collumPrompt.style.pointerEvents = 'none';
        })
        return collumPrompt;
    },
    initializeCollum:function(callback){
        collumPrompt.querySelector('#confirm').addEventListener('click', ()=>{
            callback();
        })
    },
    getCollumOption:function(){
        return collumPrompt.querySelector('#type').value;
    }
}

module.exports = {
    components,
    initialize
};