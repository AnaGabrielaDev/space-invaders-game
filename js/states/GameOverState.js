import { controls } from "../controls.js";
import { CountState } from "./CountState.js";

export class GameOverState {
  saved = false;
  brokenRecord = false;
  records = [];

  constructor() {
    this.records = JSON.parse(localStorage.getItem("records")) ?? [];
  }

  update(game) {
    if (!this.saved) {
      const { score: biggestRecord } = this.records.reduce(
        (acc, currentValue) => {
          if (acc.score > currentValue.score) return acc;

          return currentValue;
        },
        {
          score: 0,
        }
      );

      if (game.player.score > biggestRecord) {
        this.brokenRecord = true;
      }

      this.records.push({
        name: game.player.name,
        score: game.player.score,
      });

      localStorage.setItem("records", JSON.stringify(this.records));
      this.saved = true;
    }
  }

  draw(game, dt, ctx) {
    ctx.clearRect(0, 0, game.width, game.height);

    ctx.font = "700 30px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.textBaseline = "center";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", game.width / 2, game.height / 2 - 40);
    ctx.font = "16px Arial";

    if (this.brokenRecord) {
      ctx.fillText(
        `Você quebrou o recorde!!! *o*`,
        game.width / 2,
        game.height / 2 - 10
      );
    } else {
      ctx.fillText(`Você perdeu! :(`, game.width / 2, game.height / 2 - 10);
    }

    ctx.fillText(
      `Você fez ${game.player.score} pontos e atingiu o nível ${game.level}`,
      game.width / 2,
      game.height / 2 + 20
    );

    ctx.font = "16px Arial";
    ctx.fillText(
      "Aperte qualquer tecla para jogar novamente ou espaço para selecionar outro jogador!",
      game.width / 2,
      game.height / 2 + 50
    );
  }

  keyDown(game, keyCode) {
    if (keyCode !== controls.KEY_SPACE) {
      game.player.lives = 3;
      game.player.score = 0;
      game.level = 1;
      game.moveToState(new CountState(1));
    } else {
      window.location.pathname = "/space-invaders-game";
    }
  }
}
