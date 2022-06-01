// Space Invaders
// Autor: Ayo Oyewole
// Adaptado por: Gilson Pereira
// Código fonte original: http://www.ayodeji.ca/space-invaders/

// Programa principal

let tela
let contexto;

tela = document.getElementById("tela");
contexto = tela.getContext("2d");

let canhao;
let laser;
let alien;

let canhaoX = 180;
let canhaoY = 529;
let laserX = 193;
let laserY = 520;
let alienX = calculatePositionFromPercent(20);
let alienY = 0;
let inicioLaser = false;
let impactoLaserX;
let laserMovendo;
let intervalo = 0;
let posicao = 0;
let endGame = false;

let alienLinhas = [10, 38, 66, 94, 122, 150, 178, 206, 234, 262, 290];
let alienColunas = [55, 85, 115, 145, 175];
let aliensRestantes = [];

let moveAlienInterval;

onkeydown = ({keyCode}) => {
    console.log(keyCode)
    if(SPACE_BAR == keyCode && endGame === true) {
        contexto.restore();
        return iniciar();
    }

    moverCanhao(keyCode); // Define função chamada ao se pressionar uma tecla
}

iniciar(); // Chama função inicial do jogo

// Sub-rotinas (funções)
function iniciar() {
    endGame = false;
	
    contexto.fillStyle = "black";
	contexto.fillRect(0, 0, tela.width, tela.height);

    posicionarAlien();
    carregarImagens();

	moveAlienInterval = setInterval("moverAliens()", intervalo);
    setInterval("alienAtingido()", 6);
}    

function posicionarAlien() {
    for (let i = 0; i < alienLinhas.length; i++){
        for (let j = 0; j < alienColunas.length; j++){
            let novoAlien = {
                posX : alienLinhas[i],
                posY : alienColunas[j],
                foiAtingido : false
			};
			
            aliensRestantes.push(novoAlien)
        }
    }
}    

function carregarImagens() {
    canhao = new Image();
    canhao.src = "assets/imgs/canhao.png";
    canhao.onload = function(){
        contexto.drawImage(canhao, canhaoX, canhaoY);
    }
    
    laser = new Image();
    laser.src = "assets/imgs/laser.png";
    
    alien = new Image();
    alien.src = "assets/imgs/alien.png";
}

function calculatePositionFromPercent(percent) {
    return Math.floor((tela.width * percent) / 100);
}

function calculatePercent(position) {
    return Math.floor((position * 100) / tela.width);
}

let isBacking = false;
function invertDirection() {
    isBacking = !isBacking
    if(!isBacking) 
        console.log("is not backing")
    else 
        console.log("is backing")
}

function moverAliens(){
    // alienX = tela.width/2;

    const alienXToPercent = calculatePercent(alienX);
    if(alienXToPercent % 2 === 0) console.log(alienXToPercent)

    if (alienXToPercent <= 75 && !isBacking){
        alienX += 1;
    } else if (alienXToPercent > 75 && alienXToPercent < 80 && !isBacking){
        alienX += 1;
        alienY += 1
        if(alienXToPercent === 79) {
            invertDirection()
        }
    } else if (alienXToPercent >= 15 && isBacking){
        alienX -= 1;
    }else if (alienXToPercent < 15 && isBacking){
        alienX -= 1;
        alienY += 1;
        if(alienXToPercent === 11) {
            invertDirection()
        }
    }
    
    for(const currentAlien of aliensRestantes){
        if (currentAlien.foiAtingido) continue;

        contexto.fillRect((alienX + currentAlien.posX - 1), (alienY + currentAlien.posY - 1), 20, 25);
        contexto.drawImage(alien, (alienX + currentAlien.posX), (alienY + currentAlien.posY));
        
        if ((currentAlien.posY + alienY + 23) >= 530){
            return fimDeJogo();
        }
    }
}

function alienAtingido(){
    for(const currentAlien of aliensRestantes) {
        if (
            (laserY >= (alienY + currentAlien.posY)) 
            && (laserY <= (alienY + currentAlien.posY + 20)) 
            && (impactoLaserX >= (alienX + currentAlien.posX - 5)) 
            && (impactoLaserX <= (alienX + currentAlien.posX + 18))
            && !currentAlien.foiAtingido
        ){
            contexto.fillStyle = "black";
            contexto.fillRect((alienX + currentAlien.posX - 1), (alienY + currentAlien.posY - 1), 20, 25);
            currentAlien.foiAtingido = true;
            contexto.fillRect(impactoLaserX, laserY, 6, 19);
            laserY = 0;
        }
    }
}

function fimDeJogo(){
    canhaoX = 180;
    laserX = 193;
    laserY = 520;
    alienX = calculatePositionFromPercent(20);
    alienY = 0;
    posicao = 0;
    aliensRestantes = [];
    inicioLaser = false;
	
    contexto.fillStyle = "black";
	contexto.fillRect(0, 0, tela.width, tela.height);
    
    contexto.textAlign = "center";
    contexto.font = "16px Arial";
    contexto.fillStyle = "white";

    contexto.fillText("Fim de Jogo", tela.width / 2, tela.height / 2);
    contexto.fillText("Press space to restart", tela.width / 2, (tela.height / 2) + 30);

    endGame = true;

    clearInterval(moveAlienInterval);
}