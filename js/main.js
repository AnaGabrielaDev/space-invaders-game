// Space Invaders
// Autor: Ayo Oyewole
// Adaptado por: Gilson Pereira
// Código fonte original: http://www.ayodeji.ca/space-invaders/

// Programa principal

let tela
let contexto;

let canhao;
let laser;
let alien;

let canhaoX = 180;
let canhaoY = 529;
let laserX = 193;
let laserY = 520;
let alienX = 0;
let alienY = 0;
let inicioLaser = false;
let impactoLaserX;
let laserMovendo;
let intervalo = 10;
let posicao = 0;
let endGame = false;

let alienLinhas = [10, 38, 66, 94, 122, 150, 178, 206, 234, 262, 290];
let alienColunas = [55, 85, 115, 145, 175];
let aliensRestantes = [];

let moveAlienInterval;

tela = document.getElementById("tela");
contexto = tela.getContext("2d");

onkeydown = ({keyCode}) => {
    if(SPACE_BAR == keyCode && endGame === true) {
        console.log(c);
        contexto.restore();
        return iniciar()
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

function moverAliens(){
    console.log(posicao)
        if (posicao <= 550){
            alienX += 1;
            posicao += 1;
        } else if ((posicao > 550) && (posicao <= 580)){
            alienX += 1;
            alienY += 1
            posicao += 1;            
        } else if ((posicao > 580) && (posicao <= 1130)){
            alienX -= 1;
            posicao += 1;
        }else if ((posicao > 1130) && (posicao < 1160)){
            alienX -= 1;
            alienY += 1;
            posicao += 1;
        } else{
            posicao = 0;
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
    alienX = 0;
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