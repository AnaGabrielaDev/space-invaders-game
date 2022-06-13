import { Cannon, Alien, FireAlien, Fire } from "../elements/index.js";
import { GameOverState } from "../states/GameOverState.js";
import { controls } from "../controls.js";
import { CountState } from "./CountState.js";

export class PlayState {
  config;
  level;
  images;

  constructor(config, level) {
    this.config = config;
    this.level = level;

    this.alienCurrentVelocity = 10;
    this.alienCurrentDropDistance = 0;
    this.aliensAreDropping = false;
    this.lastFireTime = null;

    //  Game entities.
    this.cannon = null;
    this.aliens = [];
    this.fires = [];
    this.fireAliens = [];

    const cannon = new Image();
    cannon.src = "./assets/imgs/cannon.png";

    const alien = new Image();
    alien.src = "./assets/imgs/alien.png";

    const fire = new Image();
    fire.src = "./assets/imgs/fire.png";

    this.images = {
      cannon,
      alien,
      fire,
    };
  }

  enter(game) {
    this.cannon = new Cannon(
      game.width / 2,
      game.limits.bottom,
      this.images.cannon
    );

    this.alienCurrentVelocity = 10;
    this.alienCurrentDropDistance = 0;
    this.aliensAreDropping = false;

    const levelMultiplier = this.level * this.config.levelDifficultyMultiplier;
    const limitLevel =
      this.level < this.config.limitLevelIncrease
        ? this.level
        : this.config.limitLevelIncrease;
    this.cannonSpeed = this.config.cannonSpeed;
    this.alienInitialVelocity =
      this.config.alienInitialVelocity +
      1.5 * (levelMultiplier * this.config.alienInitialVelocity);
    this.fireAlienRate =
      this.config.fireAlienRate + levelMultiplier * this.config.fireAlienRate;
    this.fireAlienMinVelocity =
      this.config.fireAlienMinVelocity +
      levelMultiplier * this.config.fireAlienMinVelocity;
    this.fireAlienMaxVelocity =
      this.config.fireAlienMaxVelocity +
      levelMultiplier * this.config.fireAlienMaxVelocity;
    this.fireMaxFireRate = this.config.fireMaxFireRate + 0.4 * limitLevel;

    const ranks = this.config.alienRanks + 0.1 * limitLevel;
    const files = this.config.alienFiles + 0.2 * limitLevel;
    const aliens = [];
    for (let rank = 0; rank < ranks; rank++) {
      for (let file = 0; file < files; file++) {
        aliens.push(
          new Alien(
            game.width / 2 + ((files / 2 - file) * 225) / files,
            game.limits.top + rank * 25,
            rank,
            file,
            "Alien",
            this.images.alien
          )
        );
      }
    }
    this.aliens = aliens;
    this.alienCurrentVelocity = this.alienInitialVelocity;
    this.alienVelocity = { x: -this.alienInitialVelocity, y: 0 };
    this.alienNextVelocity = null;
  }

  sendFire() {
    const fireSfx = document.getElementById("fireSfx").cloneNode(true);
    fireSfx.volume = 0.1;
    if (
      this.lastFireTime === null ||
      new Date().valueOf() - this.lastFireTime > 1000 / this.fireMaxFireRate
    ) {
      fireSfx.play();
      this.fires.push(
        new Fire(
          this.cannon.x,
          this.cannon.y - 12,
          this.config.fireVelocity,
          this.images.fire
        )
      );
      this.lastFireTime = new Date().valueOf();
    }
  }

  keyDown(game, keyCode) {
    if (keyCode == controls.KEY_SPACE) {
      this.sendFire();
    }
    if (keyCode == 80) {
      game.pushState(new PauseState());
    }
  }

  update(game, dt) {
    if (game.pressedKeys[controls.KEY_LEFT]) {
      this.cannon.x -= this.cannonSpeed * dt;
    }
    if (game.pressedKeys[controls.KEY_RIGHT]) {
      this.cannon.x += this.cannonSpeed * dt;
    }
    if (game.pressedKeys[controls.KEY_SPACE] || game.leftButton) {
      this.sendFire();
    }
    if (game.mouseXPosition) {
      this.cannon.x =
        game.mouseXPosition - (window.innerWidth / 2 - game.width / 2);
    }

    if (this.cannon.x < game.limits.left) {
      this.cannon.x = game.limits.left;
    }
    if (this.cannon.x > game.limits.right) {
      this.cannon.x = game.limits.right;
    }

    //  Mover os fireAlien.
    for (let i = 0; i < this.fireAliens.length; i++) {
      let fireAlien = this.fireAliens[i];
      fireAlien.y += dt * fireAlien.velocity;

      //  apagar aos tiros fora
      if (fireAlien.y > this.height) {
        this.fireAliens.splice(i--, 1);
      }
    }

    //  mover os misseis
    for (let i = 0; i < this.fires.length; i++) {
      let fire = this.fires[i];
      fire.y -= dt * fire.velocity;

      if (fire.y < 0) {
        this.fires.splice(i--, 1);
      }
    }

    //  Move the aliens.
    let hitLeft = false,
      hitRight = false,
      hitBottom = false;
    for (let i = 0; i < this.aliens.length; i++) {
      let alien = this.aliens[i];
      let newx = alien.x + this.alienVelocity.x * dt;
      let newy = alien.y + this.alienVelocity.y * dt;
      if (hitLeft == false && newx < game.limits.left) {
        hitLeft = true;
      } else if (hitRight == false && newx > game.limits.right) {
        hitRight = true;
      } else if (hitBottom == false && newy > game.limits.bottom) {
        hitBottom = true;
      }

      if (!hitLeft && !hitRight && !hitBottom) {
        alien.x = newx;
        alien.y = newy;
      }
    }

    //  Update alien velocities.
    if (this.aliensAreDropping) {
      this.alienCurrentDropDistance += this.alienVelocity.y * dt;
      if (this.alienCurrentDropDistance >= this.config.alienDropDistance) {
        this.aliensAreDropping = false;
        this.alienVelocity = this.alienNextVelocity;
        this.alienCurrentDropDistance = 0;
      }
    }
    //  If we've hit the left, move down then right.
    if (hitLeft) {
      this.alienCurrentVelocity += this.config.alienAcceleration;
      this.alienVelocity = { x: 0, y: this.alienCurrentVelocity };
      this.aliensAreDropping = true;
      this.alienNextVelocity = { x: this.alienCurrentVelocity, y: 0 };
    }
    //  If we've hit the right, move down then left.
    if (hitRight) {
      this.alienCurrentVelocity += this.config.alienAcceleration;
      this.alienVelocity = { x: 0, y: this.alienCurrentVelocity };
      this.aliensAreDropping = true;
      this.alienNextVelocity = { x: -this.alienCurrentVelocity, y: 0 };
    }
    //  If we've hit the bottom, it's game over.
    if (hitBottom) {
      game.player.lives = 0;
    }

    //ver se o tiro atingiu alien
    for (let i = 0; i < this.aliens.length; i++) {
      let alien = this.aliens[i];
      let bang = false;

      for (let j = 0; j < this.fires.length; j++) {
        let fire = this.fires[j];

        if (
          fire.x >= alien.x - alien.width / 2 &&
          fire.x <= alien.x + alien.width / 2 &&
          fire.y >= alien.y - alien.height / 2 &&
          fire.y <= alien.y + alien.height / 2
        ) {
          const alienHitSfx = document
            .getElementById("alienHitSfx")
            .cloneNode(true);
          alienHitSfx.volume = 0.15;
          alienHitSfx.play();
          this.fires.splice(j--, 1);
          bang = true;
          game.player.score += this.config.pointsPerAlien;
          break;
        }
      }
      if (bang) {
        this.aliens.splice(i--, 1);
      }
    }
    let frontRankAliens = {};
    for (let i = 0; i < this.aliens.length; i++) {
      let alien = this.aliens[i];
      if (
        !frontRankAliens[alien.file] ||
        frontRankAliens[alien.file].rank < alien.rank
      ) {
        frontRankAliens[alien.file] = alien;
      }
    }

    //  Give each front rank alien a chance to drop a fireAlien.
    for (let i = 0; i < this.config.alienFiles; i++) {
      let alien = frontRankAliens[i];
      if (!alien) continue;
      let chance = this.fireAlienRate * dt;
      if (chance > Math.random()) {
        this.fireAliens.push(
          new FireAlien(
            alien.x,
            alien.y + alien.height / 2,
            this.fireAlienMinVelocity +
              Math.random() *
                (this.fireAlienMaxVelocity - this.fireAlienMinVelocity)
          )
        );
      }
    }

    //  Check for fireAlien/cannon collisions.
    for (let i = 0; i < this.fireAliens.length; i++) {
      let fireAlien = this.fireAliens[i];
      if (
        fireAlien.x >= this.cannon.x - this.cannon.width / 2 &&
        fireAlien.x <= this.cannon.x + this.cannon.width / 2 &&
        fireAlien.y >= this.cannon.y - this.cannon.height / 2 &&
        fireAlien.y <= this.cannon.y + this.cannon.height / 2
      ) {
        const cannonHitSfx = document
          .getElementById("cannonHitSfx")
          .cloneNode(true);
        cannonHitSfx.volume = 0.125;

        cannonHitSfx.play();
        this.fireAliens.splice(i--, 1);
        game.player.lives--;
      }
    }

    //  Check for alien/cannon collisions.
    for (let i = 0; i < this.aliens.length; i++) {
      let alien = this.aliens[i];
      if (
        alien.x + alien.width / 2 > this.cannon.x - this.cannon.width / 2 &&
        alien.x - alien.width / 2 < this.cannon.x + this.cannon.width / 2 &&
        alien.y + alien.height / 2 > this.cannon.y - this.cannon.height / 2 &&
        alien.y - alien.height / 2 < this.cannon.y + this.cannon.height / 2
      ) {
        //  Dead by collision!
        game.player.lives = 0;
      }
    }

    //  Check for failure
    if (game.player.lives <= 0) {
      const phaseOst = document.getElementById("phaseOst");
      phaseOst.volume = 0.1;

      const gameOverSfx = document
        .getElementById("gameOverSfx")
        .cloneNode(true);
      gameOverSfx.volume = 0.25;

      gameOverSfx.play();
      game.moveToState(new GameOverState());
    }

    //  Check for victory
    if (this.aliens.length === 0) {
      const phaseOst = document.getElementById("phaseOst");
      phaseOst.volume = 0.05;

      const winSfx = document.getElementById("winSfx").cloneNode(true);
      winSfx.volume = 0.125;

      winSfx.play();
      game.player.score += this.level * 50;
      game.level += 1;
      game.moveToState(new CountState(game.level));
    }
  }

  draw(game, dt, ctx) {
    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);

    //  Draw cannon.
    ctx.drawImage(
      this.cannon.image,
      this.cannon.x - this.cannon.width / 2,
      this.cannon.y - this.cannon.height / 2,
      this.cannon.width,
      this.cannon.height
    );

    //  Draw aliens.
    ctx.fillStyle = "#006600";
    for (let i = 0; i < this.aliens.length; i++) {
      let alien = this.aliens[i];
      ctx.drawImage(
        this.aliens[i].image,
        alien.x - alien.width / 2,
        alien.y - alien.height / 2,
        alien.width,
        alien.height
      );
    }

    //  Draw fireAliens.
    ctx.fillStyle = "#ff5555";
    for (let i = 0; i < this.fireAliens.length; i++) {
      const fireAlien = this.fireAliens[i];
      ctx.fillRect(fireAlien.x - 2, fireAlien.y - 2, 6, 6);
    }
    //  adicionar os tiros
    for (let i = 0; i < this.fires.length; i++) {
      let fire = this.fires[i];
      ctx.drawImage(fire.image, fire.x, fire.y - 2, 2, 12);
    }

    //  Draw info.
    const textYpos =
      game.limits.bottom + (game.height - game.limits.bottom) / 2 + 14 / 2;
    ctx.font = "14px Arial";
    ctx.fillStyle = "#FFFFFF";
    let info = "Lives: " + game.player.lives;
    ctx.textAlign = "left";
    ctx.fillText(info, game.limits.left, textYpos);
    info = "Score: " + game.player.score + ", Level: " + game.level;
    ctx.textAlign = "right";
    ctx.fillText(info, game.limits.right, textYpos);

    if (this.config.debugMode) {
      ctx.strokeStyle = "#ff0000";
      ctx.strokeRect(0, 0, game.width, game.height);
      ctx.strokeRect(
        game.limits.left,
        game.limits.top,
        game.limits.right - game.limits.left,
        game.limits.bottom - game.limits.top
      );
    }
  }
}
