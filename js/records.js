const nameField = document.getElementById("nameField");
const buttonName = document.getElementById("playButton");
const score = document.getElementById("playerList");
const myStorage = localStorage;
const validCharacters = /[a-zA-Z]/;

let users = [];
if (myStorage.getItem("records")) {
  users = JSON.parse(myStorage.getItem("records"));
} else {
  const noPlayers = document.createElement("li");
  noPlayers.innerHTML = "Nenhum jogador registrado!";

  score.appendChild(noPlayers);
}

// Sorting algorithm using array functions
// users = users
//   .sort((a, b) => b.score - a.score)
//   .filter((user, index) => index < 5);

// Sorting algorithm taught in the classroom
for (let i = 0; i < users.length; i++) {
  for (let j = i; j < users.length; j++) {
    if (users[j].score > users[i].score) {
      let auxiliary = users[i];
      users[i] = users[j];
      users[j] = auxiliary;
    }
  }
}

for (const [index, user] of users.entries()) {
  console.log(user, index)
  if (index >= 5) break;

  const userName = document.createElement("li");
  userName.innerHTML = `${user.name} - ${user.score}`;

  score.appendChild(userName);
}

nameField.addEventListener("keypress", (event) => {
  if (!validCharacters.test(event.key))
    event.preventDefault();

  if (event.key === "Enter")
    playButton.click();
})

function saveName() {
  if (nameField.value.length === 4) { 
    const username = nameField.value.trim().toUpperCase();
    users.push(username);
    // myStorage.setItem("nameField", JSON.stringify(users));
    
    window.location.replace(`game.html?name=${username}`);
  } else {
    alert("Seu nome de usuário precisa possuir 4 letras!");
  }
}

function typeWrite(element) {
  const textArray = element.innerHTML.split("");
  element.innerHTML = "";
  textArray.forEach((letter, i) => {
    setTimeout(() => (element.innerHTML += letter), 75 * i);
  });
}

const title = document.querySelector("#typewriter");
typeWrite(title);
