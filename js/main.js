import { Game } from "./Game.js";

function inicialize() {
  const url = window.location.href;

  const [, params] = url.split("?");
  const [, name] = params.split("=");

  const canvas = document.getElementById("game");
  canvas.width = 800;
  canvas.height = 600;

  const game = new Game(canvas);
  game.start(name, gameLoop);

  const phaseMusic = document.getElementById("phaseOst");
  phaseMusic.volume = 0.2;

  window.addEventListener("keydown", function keydown(e) {
    const keycode = e.which || window.event.keycode;
    game.keyDown(keycode);
  });

  window.addEventListener("keyup", function keydown(e) {
    const keycode = e.which || window.event.keycode;
    game.keyUp(keycode);
  });

  window.addEventListener(
    "touchstart",
    function (e) {
      game.touchstart(e);
    },
    false
  );

  window.addEventListener(
    "touchend",
    function (e) {
      game.touchend(e);
    },
    false
  );

  window.addEventListener(
    "touchmove",
    function (e) {
      game.touchmove(e);
    },
    false
  );

  canvas.addEventListener("mouseup", (event) => {
    game.mouseUp(event.button);
  });

  canvas.addEventListener("mousedown", (event) => {
    game.mouseDown(event.button);
  });

  canvas.addEventListener("mousemove", (event) => {
    game.moveMouse(event.clientX, false);

    function mouseStopped() {
      if (game.mouseXPosition === event.clientX)
        game.moveMouse(event.clientX, true);
    }

    setTimeout(mouseStopped, 500);
  });
}
inicialize();

function gameLoop(game) {
  let currentState = game.currentState();
  if (currentState) {
    let context = game.container.getContext("2d");

    if (currentState.update) {
      currentState.update(game, game.delta, context);
    }
    if (currentState.draw) {
      currentState.draw(game, game.delta, context);
    }
  }
}
