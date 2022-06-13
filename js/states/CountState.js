import { PlayState } from "./PlayState.js";

export class CountState {
  level;
  countdown;
  countdownMessage;

  constructor(level) {
    this.level = level;
    this.countdown = 3;
    this.countdownMessage = "3";
  }

  draw(game, _dt, context) {
    context.clearRect(0, 0, game.width, game.height);

    context.font = "700 36px Arial";
    context.fillStyle = "#FFFFFF";
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.fillText(
      "Nivel " + this.level,
      game.width / 2,
      game.height / 2 - 18
    );
    context.font = "24px Arial";
    context.fillText(
      "Começando em... " + this.countdownMessage,
      game.width / 2,
      game.height / 2 + 18
    );
    return;
  }

  update(game, dt) {
    this.countdown -= dt;

    if (this.countdown < 2) {
      this.countdownMessage = "2";
    }
    if (this.countdown < 1) {
      this.countdownMessage = "1";
    }
    if (this.countdown <= 0) {
      const phaseOst = document.getElementById("phaseOst");
      phaseOst.volume = 0.2;
      game.moveToState(new PlayState(game.configInicial, this.level));
    }
  }
}
