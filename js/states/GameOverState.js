import { controls } from "../controls.js";
import { LevelIntroState } from "./LevelIntroState.js";

export class GameOverState {
  saved = false;
  update(game) {
    if (!this.saved) {
      const records = JSON.parse(localStorage.getItem("records")) ?? [];
      records.push({
        name: game.player.name,
        score: game.player.score,
      });

      localStorage.setItem("records", JSON.stringify(records));
      this.saved = true;
    }
  }
  draw(game, dt, ctx) {
    ctx.clearRect(0, 0, game.width, game.height);

    ctx.font = "30px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.textBaseline = "center";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", game.width / 2, game.height / 2 - 40);
    ctx.font = "16px Arial";
    ctx.fillText(
      "You scored " + game.player.score + " and got to level " + game.level,
      game.width / 2,
      game.height / 2
    );
    ctx.font = "16px Arial";
    ctx.fillText(
      "Press any key to play again or 'Space' to select another player.",
      game.width / 2,
      game.height / 2 + 40
    );
  }
  keyDown(game, keyCode) {
    if (keyCode !== controls.KEY_SPACE) {
      game.player.lives = 3;
      game.player.score = 0;
      game.level = 1;
      game.moveToState(new LevelIntroState(1));
    } else {
      window.location.replace("/");
    }
  }
}
