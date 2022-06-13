import { controls } from "../controls.js";
import { CountState } from "./CountState.js";

export class State {
  type;
  constructor(stateType = "initial") {
    this.type = stateType;
  }
  enter(game) {}
  draw(game, _dt, context) {
    if (this.type !== "initial") return;

    context.clearRect(0, 0, game.width, game.height);

    context.font = "700 30px Arial";
    context.fillStyle = "#FFFFFF";
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.fillText("Space Invaders", game.width / 2, game.height / 2 - 20);
    context.font = "16px Arial";

    context.fillText(
      "Aperte espaço para iniciar!",
      game.width / 2,
      game.height / 2 + 20
    );
  }
  keyDown(game, keyCode) {
    if (keyCode !== controls.KEY_SPACE || this.type !== "initial") return;

    game.level = 1;
    game.player.score = 0;
    game.player.lives = 3;
    game.moveToState(new CountState(game.level));
  }
}
