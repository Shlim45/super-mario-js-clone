import {Trait, Sides} from '../Entity.js';
import Sound from '../Sound.js';

export default class Jump extends Trait {
  constructor() {
    super('jump');

    this.ready = 0;
    this.duration = 0.25;
    this.engageTime = 0;
    this.requestTime = 0;
    this.gracePeriod = 0.1;
    this.speedBoost = 0.2;
    this.velocity = 200;

    this.sound = new Sound('../../sfx/Jump.wav');
  }

  get falling() {
    return this.ready < 0;
  }

  start() {
    this.requestTime = this.gracePeriod;
  }

  cancel() {
    this.engageTime = 0;
    this.requestTime = 0;
  }

  obstruct(entity, side) {
    if (side === Sides.BOTTOM) {
      this.ready = 1;
    } else if (side === Sides.TOP) {
      this.cancel();
    }
  }

  update(entity, deltaTime) {
    if (this.requestTime > 0) {
      if (this.ready > 0) {
        this.sound.play();
        this.engageTime = this.duration;
        this.requestTime = 0;
      }

      this.requestTime -= deltaTime;
    }

    if (this.engageTime > 0) {
      entity.vel.y = -(this.velocity + Math.abs(entity.vel.x) * this.speedBoost);
      this.engageTime -= deltaTime;
    }

    this.ready--;
  }
}