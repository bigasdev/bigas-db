function initialize(){
    collumPrompt = document.getElementById('collum-prompt');
    console.log(collumPrompt);
}

let collumPrompt;


var components = {
    savedPath: '',
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
    },
    getCollumName:function(){
        return collumPrompt.querySelector('#name').value;
    },
    renderSaved:function(path){
        this.savedPath = path;
        console.log('saved '+this.savedPath);
    },
    getSavedPath:function(){
        console.log(this.savedPath);
        return this.savedPath;
    }
}

module.exports = {
    components,
    initialize
};