import { Player } from "./elements/Player.js";
import { State } from "./states/State.js";

export class Game {
  container;
  width;
  height;
  limits;
  player;
  delta;
  intervalId;
  stateStack = [];
  pressedKeys = [];
  leftButton;
  mouseXPosition;

  initialConfig = {
    fireAlienRate: 0.05,
    fireAlienMinVelocity: 75,
    fireAlienMaxVelocity: 75,
    alienInitialVelocity: 25,
    alienAcceleration: 0,
    alienDropDistance: 20,
    fireVelocity: 180,
    fireMaxFireRate: 2,
    gameWidth: 400,
    gameHeight: 300,
    fps: 50,
    debugMode: false,
    alienRanks: 5,
    alienFiles: 10,
    cannonSpeed: 120,
    levelDifficultyMultiplier: 0.2,
    pointsPerAlien: 5,
    limitLevelIncrease: 25,
  };

  constructor(container) {
    this.container = container;
    this.width = container.width;
    this.height = container.height;

    this.limits = {
      left: container.width / 2 - this.initialConfig.gameWidth / 2,
      right: container.width / 2 + this.initialConfig.gameWidth / 2,
      top: container.height / 2 - this.initialConfig.gameHeight / 2,
      bottom: container.height / 2 + this.initialConfig.gameHeight / 2,
    };
    this.delta = 1 / this.initialConfig.fps;
  }

  start(name, callback) {
    this.player = new Player(name);

    this.moveToState(new State());

    this.intervalId = setInterval(
      () => callback(this),
      1000 / this.initialConfig.fps
    );
  }

  moveToState(state) {
    if (this.currentState() && this.currentState().leave) {
      this.currentState().leave(this);
      this.stateStack.pop();
    }

    if (state.enter) {
      state.enter(this);
    }

    this.stateStack.pop();
    this.stateStack.push(state);
  }

  currentState() {
    return this.stateStack.length > 0
      ? this.stateStack[this.stateStack.length - 1]
      : null;
  }

  pushState(state) {
    //  If there's an enter function for the new state, call it.
    if (state.enter) {
      state.enter(this);
    }
    //  Set the current state.
    this.stateStack.push(state);
  }

  popState() {
    if (!this.currentState()) return;

    if (this.currentState().leave) {
      this.currentState().leave(this);
    }

    this.stateStack.pop();
  }

  stop() {
    clearInterval(this.intervalId);
  }

  keyUp(keyCode) {
    delete this.pressedKeys[keyCode];
    //  Delegate to the current state too.
    if (this.currentState() && this.currentState().keyUp) {
      this.currentState().keyUp(this, keyCode);
    }
  }

  keyDown(keyCode) {
    this.pressedKeys[keyCode] = true;

    if (this.currentState() && this.currentState().keyDown) {
      this.currentState().keyDown(this, keyCode);
    }
  }

  mouseUp(button) {
    if (button === 0) this.leftButton = false;
  }

  mouseDown(button) {
    if (button === 0) this.leftButton = true;
  }

  moveMouse(position, isStopped) {
    if (isStopped) this.mouseXPosition = false;
    else this.mouseXPosition = position;
  }
}
