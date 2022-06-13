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

  configInicial = {
    tiroAlienRate: 0.05,
    tiroAlienMinVel: 75,
    tiroAlienMaxVel: 75,
    alienVelInicial: 25,
    alienAceleracao: 0,
    alienDropDistancia: 20,
    tiroVelocidade: 180,
    tiroVelMax: 2,
    gameWidth: 400,
    gameHeight: 300,
    fps: 50,
    alienFileiras: 2,
    alienColunas: 4,
    velCanhao: 120,
    dificuldadePorNivel: 0.2,
    pontosPorAlien: 1,
    limiteNivel: 25,
  };

  constructor(container) {
    this.container = container;
    this.width = container.width;
    this.height = container.height;

    this.limits = {
      left: container.width / 2 - this.configInicial.gameWidth / 2,
      right: container.width / 2 + this.configInicial.gameWidth / 2,
      top: container.height / 2 - this.configInicial.gameHeight / 2,
      bottom: container.height / 2 + this.configInicial.gameHeight / 2,
    };
    this.delta = 1 / this.configInicial.fps;
  }

  start(name, callback) {
    this.player = new Player(name);

    this.moveToState(new State());

    this.intervalId = setInterval(
      () => callback(this),
      1000 / this.configInicial.fps
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
    //  mudar o estado
    if (state.enter) {
      state.enter(this);
    }
    //  setar o estado atual
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
