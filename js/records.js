const nameUser = document.getElementById("nameField");
const buttonName = document.getElementById("playButton");
const score = document.getElementById("playerList");
const meuStorage = localStorage;

let users = [];
if (meuStorage.getItem("records"))
  users = JSON.parse(meuStorage.getItem("records"));
else {
  const noPlayers = document.createElement("li");
  noPlayers.innerHTML = "Nenhum jogador registrado!";

  score.appendChild(noPlayers);
}

users = users
  .sort((a, b) => {
    return b.score - a.score;
  })
  .filter((user, index) => index < 10);

for (const user of users) {
  const userName = document.createElement("li");
  userName.innerHTML = `${user.name} - ${user.score}`;

  score.appendChild(userName);
}

function saveName() {
  users.push(nameUser.value);
  // meuStorage.setItem("nameUser", JSON.stringify(users));

  window.location.replace(`/game.html?name=${nameUser.value}`);
}

function typeWrite(elemento) {
  const textoArray = elemento.innerHTML.split("");
  elemento.innerHTML = "";
  textoArray.forEach((letra, i) => {
    setTimeout(() => (elemento.innerHTML += letra), 75 * i);
  });
}

const titulo = document.querySelector(".maquina-escrever");
typeWrite(titulo);
