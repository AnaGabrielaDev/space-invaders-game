const nameUser = document.getElementById('nameField');
const buttonName = document.getElementById('playButton');
const score = document.getElementById('players');
const meuStorage = sessionStorage;

let users = [];
if(meuStorage.getItem("nameUser")) users = JSON.parse(meuStorage.getItem("nameUser"));
for(const user of users) {
    const userName = document.createElement('p');
    userName.innerHTML = user

    score.appendChild(userName);
}

function saveName() {
    users.push(nameUser.value);
    console.log(users);
    meuStorage.setItem('nameUser', JSON.stringify(users));
    nameUser.value = "";

    window.location.replace("/initialScreen.html");
}

function typeWrite(elemento) {
    const textoArray = elemento.innerHTML.split('');
    elemento.innerHTML = ''
    textoArray.forEach((letra, i) =>{
        setTimeout(() => elemento.innerHTML += letra, 75 * i);
    }) 
}
const titulo = document.querySelector('.maquina-escrever');
typeWrite(titulo);
