const SPACE_BAR = 32;
const TECLA_ESQUERDA = 37;
const TECLA_DIREITA = 39;
const TECLA_ACIMA = 38;

function moverCanhao(codigo){
  if ((codigo == TECLA_DIREITA) && (canhaoX <= 360)){
    c.fillStyle = "black";
    c.fillRect(canhaoX, 537, 31, 19);
    canhaoX += 8;
    laserX += 8;
    c.drawImage(canhao, canhaoX, canhaoY);
  }
  
  if ((codigo == TECLA_ESQUERDA) && (canhaoX >= 9)){
    c.fillStyle = "black";
    c.fillRect(canhaoX, 537, 31, 19);
    canhaoX -= 8;
    laserX -= 8;
    c.drawImage(canhao, canhaoX, canhaoY);
  }
  
  if ((codigo == TECLA_ACIMA) && !inicioLaser){
    inicioLaser = true;
    c.drawImage(laser, laserX, laserY);
    impactoLaserX = laserX;
    laserMovendo = setInterval("dispararLaser()", 5);
  }
}

function dispararLaser(){
  if (inicioLaser && (laserY >= 60)){
      laserY -= 10;
      c.fillStyle = "black";
      c.fillRect(impactoLaserX, (laserY + 10), 6, 19);
  
      if (laserY >= 70){
          c.drawImage(laser, impactoLaserX, laserY);
      }
  }

  if (laserY < 60){
      clearInterval(laserMovendo);
      inicioLaser = false;
      laserY = 520;
  }
}