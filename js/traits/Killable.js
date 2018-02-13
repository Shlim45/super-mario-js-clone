import {Sides, Trait} from '../Entity.js';
import Sound from '../Sound.js';

export default class Killable extends Trait {
    constructor() {
        super('killable');
        this.dead = false;
        this.deadTime = 0;
        this.removeAfter = 2;
        this.sound = null;
    }

    setSound(src) {
        this.sound = new Sound(src);
    }

    kill() {
        this.queue(() => this.dead = true);
        // temporarily play death sounds here
        (this.sound && this.sound.play());
    }

    revive() {
        this.dead = false;
        this.deadTime = 0;
    }

    update(entity, deltaTime, level) {
        if (this.dead) {
            this.deadTime += deltaTime;
            if (this.deadTime > this.removeAfter) {
                this.queue(() => {
                    level.entities.delete(entity);
                })
            }
        }
    }
}