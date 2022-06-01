const SPACE_BAR = 32;
const TECLA_ESQUERDA = 37;
const TECLA_DIREITA = 39;
const TECLA_ACIMA = 38;

function moverCanhao(codigo){
  if ((codigo == TECLA_DIREITA) && (canhaoX <= calculatePositionFromPercent(95))){
    contexto.fillStyle = "black";
    contexto.fillRect(canhaoX, 500, tela.width, tela.height);
    canhaoX += 10;
    laserX += 10;
    contexto.drawImage(canhao, canhaoX, canhaoY);
  }
  
  if ((codigo == TECLA_ESQUERDA) && (canhaoX >= calculatePositionFromPercent(15))){
    contexto.fillStyle = "black";
    contexto.fillRect(canhaoX, 500, tela.width, tela.height);
    canhaoX -= 10;
    laserX -= 10;
    contexto.drawImage(canhao, canhaoX, canhaoY);
  }
  
  if ((codigo == TECLA_ACIMA) && !inicioLaser){
    inicioLaser = true;
    contexto.drawImage(laser, laserX, laserY);
    impactoLaserX = laserX;
    laserMovendo = setInterval("dispararLaser()", 0);
  }
}

function dispararLaser(){
  if (inicioLaser && (laserY >= 60)){
      laserY -= 9;
      contexto.fillStyle = "black";
      contexto.fillRect(impactoLaserX, (laserY + 10), 6, 19);
  
      if (laserY >= 70){
          contexto.drawImage(laser, impactoLaserX, laserY);
      }
  }

  if (laserY < 60){
      clearInterval(laserMovendo);
      inicioLaser = false;
      laserY = 520;
  }
}