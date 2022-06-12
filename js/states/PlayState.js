import { Ship, Invader, Bomb, Rocket } from "../elements/index.js";
import { GameOverState } from "../states/GameOverState.js";
import { controls } from "../controls.js";
import { LevelIntroState } from "./LevelIntroState.js";

export class PlayState {
  config;
  level;
  images;

  constructor(config, level) {
    this.config = config;
    this.level = level;

    this.invaderCurrentVelocity = 10;
    this.invaderCurrentDropDistance = 0;
    this.invadersAreDropping = false;
    this.lastRocketTime = null;

    //  Game entities.
    this.ship = null;
    this.invaders = [];
    this.rockets = [];
    this.bombs = [];

    const ship = new Image();
    ship.src = "./assets/imgs/ship.png";

    const invader = new Image();
    invader.src = "./assets/imgs/invader.png";

    const rocket = new Image();
    rocket.src = "./assets/imgs/rocket.png";

    this.images = {
      ship,
      invader,
      rocket,
    };
  }

  enter(game) {
    this.ship = new Ship(game.width / 2, game.limits.bottom, this.images.ship);

    this.invaderCurrentVelocity = 10;
    this.invaderCurrentDropDistance = 0;
    this.invadersAreDropping = false;

    const levelMultiplier = this.level * this.config.levelDifficultyMultiplier;
    const limitLevel =
      this.level < this.config.limitLevelIncrease
        ? this.level
        : this.config.limitLevelIncrease;
    this.shipSpeed = this.config.shipSpeed;
    this.invaderInitialVelocity =
      this.config.invaderInitialVelocity +
      1.5 * (levelMultiplier * this.config.invaderInitialVelocity);
    this.bombRate =
      this.config.bombRate + levelMultiplier * this.config.bombRate;
    this.bombMinVelocity =
      this.config.bombMinVelocity +
      levelMultiplier * this.config.bombMinVelocity;
    this.bombMaxVelocity =
      this.config.bombMaxVelocity +
      levelMultiplier * this.config.bombMaxVelocity;
    this.rocketMaxFireRate = this.config.rocketMaxFireRate + 0.4 * limitLevel;

    const ranks = this.config.invaderRanks + 0.1 * limitLevel;
    const files = this.config.invaderFiles + 0.2 * limitLevel;
    const invaders = [];
    for (let rank = 0; rank < ranks; rank++) {
      for (let file = 0; file < files; file++) {
        invaders.push(
          new Invader(
            game.width / 2 + ((files / 2 - file) * 225) / files,
            game.limits.top + rank * 25,
            rank,
            file,
            "Invader",
            this.images.invader
          )
        );
      }
    }
    this.invaders = invaders;
    this.invaderCurrentVelocity = this.invaderInitialVelocity;
    this.invaderVelocity = { x: -this.invaderInitialVelocity, y: 0 };
    this.invaderNextVelocity = null;
  }

  fireRocket() {
    const rocketSfx = document.getElementById("rocketSfx").cloneNode(true);
    rocketSfx.volume = 0.1;

    if (
      this.lastRocketTime === null ||
      new Date().valueOf() - this.lastRocketTime > 1000 / this.rocketMaxFireRate
    ) {
      rocketSfx.play();
      this.rockets.push(
        new Rocket(
          this.ship.x,
          this.ship.y - 12,
          this.config.rocketVelocity,
          this.images.rocket
        )
      );
      this.lastRocketTime = new Date().valueOf();
    }
  }

  keyDown(game, keyCode) {
    if (keyCode == controls.KEY_SPACE) {
      this.fireRocket();
    }
    if (keyCode == 80) {
      game.pushState(new PauseState());
    }
  }

  update(game, dt) {
    if (game.pressedKeys[controls.KEY_LEFT]) {
      this.ship.x -= this.shipSpeed * dt;
    }
    if (game.pressedKeys[controls.KEY_RIGHT]) {
      this.ship.x += this.shipSpeed * dt;
    }
    if (game.pressedKeys[controls.KEY_SPACE] || game.leftButton) {
      this.fireRocket();
    }
    if (game.mouseXPosition) {
      this.ship.x = game.mouseXPosition - (window.innerWidth / 2 - game.width / 2);
    }

    if (this.ship.x < game.limits.left) {
      this.ship.x = game.limits.left;
    }
    if (this.ship.x > game.limits.right) {
      this.ship.x = game.limits.right;
    }

    //  Move each bomb.
    for (var i = 0; i < this.bombs.length; i++) {
      var bomb = this.bombs[i];
      bomb.y += dt * bomb.velocity;

      //  If the rocket has gone off the screen remove it.
      if (bomb.y > this.height) {
        this.bombs.splice(i--, 1);
      }
    }

    //  Move each rocket.
    for (i = 0; i < this.rockets.length; i++) {
      var rocket = this.rockets[i];
      rocket.y -= dt * rocket.velocity;

      //  If the rocket has gone off the screen remove it.
      if (rocket.y < 0) {
        this.rockets.splice(i--, 1);
      }
    }

    //  Move the invaders.
    let hitLeft = false,
      hitRight = false,
      hitBottom = false;
    for (let i = 0; i < this.invaders.length; i++) {
      let invader = this.invaders[i];
      let newx = invader.x + this.invaderVelocity.x * dt;
      let newy = invader.y + this.invaderVelocity.y * dt;
      if (hitLeft == false && newx < game.limits.left) {
        hitLeft = true;
      } else if (hitRight == false && newx > game.limits.right) {
        hitRight = true;
      } else if (hitBottom == false && newy > game.limits.bottom) {
        hitBottom = true;
      }

      if (!hitLeft && !hitRight && !hitBottom) {
        invader.x = newx;
        invader.y = newy;
      }
    }

    //  Update invader velocities.
    if (this.invadersAreDropping) {
      this.invaderCurrentDropDistance += this.invaderVelocity.y * dt;
      if (this.invaderCurrentDropDistance >= this.config.invaderDropDistance) {
        this.invadersAreDropping = false;
        this.invaderVelocity = this.invaderNextVelocity;
        this.invaderCurrentDropDistance = 0;
      }
    }
    //  If we've hit the left, move down then right.
    if (hitLeft) {
      this.invaderCurrentVelocity += this.config.invaderAcceleration;
      this.invaderVelocity = { x: 0, y: this.invaderCurrentVelocity };
      this.invadersAreDropping = true;
      this.invaderNextVelocity = { x: this.invaderCurrentVelocity, y: 0 };
    }
    //  If we've hit the right, move down then left.
    if (hitRight) {
      this.invaderCurrentVelocity += this.config.invaderAcceleration;
      this.invaderVelocity = { x: 0, y: this.invaderCurrentVelocity };
      this.invadersAreDropping = true;
      this.invaderNextVelocity = { x: -this.invaderCurrentVelocity, y: 0 };
    }
    //  If we've hit the bottom, it's game over.
    if (hitBottom) {
      game.player.lives = 0;
    }

    //  Check for rocket/invader collisions.
    for (i = 0; i < this.invaders.length; i++) {
      var invader = this.invaders[i];
      var bang = false;

      for (let j = 0; j < this.rockets.length; j++) {
        let rocket = this.rockets[j];

        if (
          rocket.x >= invader.x - invader.width / 2 &&
          rocket.x <= invader.x + invader.width / 2 &&
          rocket.y >= invader.y - invader.height / 2 &&
          rocket.y <= invader.y + invader.height / 2
        ) {
          //  Remove the rocket, set 'bang' so we don't process
          //  this rocket again.
          const invaderHitSfx = document.getElementById("invaderHitSfx").cloneNode(true);
          invaderHitSfx.volume = 0.15;
  
          invaderHitSfx.play();
          this.rockets.splice(j--, 1);
          bang = true;
          game.player.score += this.config.pointsPerInvader;
          break;
        }
      }
      if (bang) {
        this.invaders.splice(i--, 1);
      }
    }

    //  Find all of the front rank invaders.
    var frontRankInvaders = {};
    for (var i = 0; i < this.invaders.length; i++) {
      var invader = this.invaders[i];
      //  If we have no invader for game file, or the invader
      //  for game file is futher behind, set the front
      //  rank invader to game one.
      if (
        !frontRankInvaders[invader.file] ||
        frontRankInvaders[invader.file].rank < invader.rank
      ) {
        frontRankInvaders[invader.file] = invader;
      }
    }

    //  Give each front rank invader a chance to drop a bomb.
    for (var i = 0; i < this.config.invaderFiles; i++) {
      var invader = frontRankInvaders[i];
      if (!invader) continue;
      var chance = this.bombRate * dt;
      if (chance > Math.random()) {
        //  Fire!
        this.bombs.push(
          new Bomb(
            invader.x,
            invader.y + invader.height / 2,
            this.bombMinVelocity +
              Math.random() * (this.bombMaxVelocity - this.bombMinVelocity)
          )
        );
      }
    }

    //  Check for bomb/ship collisions.
    for (var i = 0; i < this.bombs.length; i++) {
      var bomb = this.bombs[i];
      if (
        bomb.x >= this.ship.x - this.ship.width / 2 &&
        bomb.x <= this.ship.x + this.ship.width / 2 &&
        bomb.y >= this.ship.y - this.ship.height / 2 &&
        bomb.y <= this.ship.y + this.ship.height / 2
      ) {
        const shipHitSfx = document.getElementById("shipHitSfx").cloneNode(true);
        shipHitSfx.volume = 0.125;

        shipHitSfx.play();
        this.bombs.splice(i--, 1);
        game.player.lives--;
      }
    }

    //  Check for invader/ship collisions.
    for (var i = 0; i < this.invaders.length; i++) {
      var invader = this.invaders[i];
      if (
        invader.x + invader.width / 2 > this.ship.x - this.ship.width / 2 &&
        invader.x - invader.width / 2 < this.ship.x + this.ship.width / 2 &&
        invader.y + invader.height / 2 > this.ship.y - this.ship.height / 2 &&
        invader.y - invader.height / 2 < this.ship.y + this.ship.height / 2
        ) {
        //  Dead by collision!
        game.player.lives = 0;
      }
    }

    //  Check for failure
    if (game.player.lives <= 0) {
      const phaseOst = document.getElementById("phaseOst");
      phaseOst.volume = 0.1;

      const gameOverSfx = document.getElementById("gameOverSfx").cloneNode(true);
      gameOverSfx.volume = 0.25;

      gameOverSfx.play();
      game.moveToState(new GameOverState());
    }

    //  Check for victory
    if (this.invaders.length === 0) {
      const phaseOst = document.getElementById("phaseOst");
      phaseOst.volume = 0.05;

      const winSfx = document.getElementById("winSfx").cloneNode(true);
      winSfx.volume = 0.125;

      winSfx.play();
      game.player.score += this.level * 50;
      game.level += 1;
      game.moveToState(new LevelIntroState(game.level));
    }
  }

  draw(game, dt, ctx) {
    //  Clear the background.
    ctx.clearRect(0, 0, game.width, game.height);

    //  Draw ship.
    ctx.drawImage(
      this.ship.image,
      this.ship.x - this.ship.width / 2,
      this.ship.y - this.ship.height / 2,
      this.ship.width,
      this.ship.height
    );

    //  Draw invaders.
    ctx.fillStyle = "#006600";
    for (let i = 0; i < this.invaders.length; i++) {
      var invader = this.invaders[i];
      ctx.drawImage(
        this.invaders[i].image,
        invader.x - invader.width / 2,
        invader.y - invader.height / 2,
        invader.width,
        invader.height
      );
    }

    //  Draw bombs.
    ctx.fillStyle = "#ff5555";
    for (let i = 0; i < this.bombs.length; i++) {
      const bomb = this.bombs[i];
      ctx.fillRect(bomb.x - 2, bomb.y - 2, 6, 6);
    }

    //  Draw rockets.
    for (let i = 0; i < this.rockets.length; i++) {
      var rocket = this.rockets[i];
      ctx.drawImage(rocket.image, rocket.x, rocket.y - 2, 2, 12);
      //   ctx.fillRect(rocket.x, rocket.y - 2, 1, 4);
    }

    //  Draw info.
    const textYpos =
      game.limits.bottom + (game.height - game.limits.bottom) / 2 + 14 / 2;
    ctx.font = "14px Arial";
    ctx.fillStyle = "#FFFFFF";
    var info = "Lives: " + game.player.lives;
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
