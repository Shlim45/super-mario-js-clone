import Entity, {Sides, Trait} from '../Entity.js';
import Solid from '../traits/Solid.js';
import Physics from '../traits/Physics.js';
import Killable from '../traits/Killable.js';
import PendulumMove from '../traits/PendulumMove.js';
import Sound from '../Sound.js';
import {loadSpriteSheet} from '../loaders.js';

export function loadKoopa() {
    return loadSpriteSheet('koopa')
    .then(createKoopaFactory);
}

const STATE_WALKING = Symbol('walking');
const STATE_HIDING  = Symbol('hiding');
const STATE_PANIC   = Symbol('panic');

const NUDGE_SOUND = new Sound('../../sfx/Thwomp.wav');
const BUMP_SOUND  = new Sound('../../Bump.wav');
const KICK_SOUND  = new Sound('../../sfx/Kick.wav');
const HIT1_SOUND  = new Sound('../../sfx/Squish.wav');

class Behavior extends Trait {
    constructor() {
        super('behavior');

        this.hideTime = 0;
        this.hideDuration = 5;

        this.walkSpeed = null;
        this.panicSpeed = 300;

        this.state = STATE_WALKING;
        
        this.NUDGE = new Sound('../../sfx/Thwomp.wav');
        this.BUMP  = new Sound('../../Bump.wav');
        this.KICK  = new Sound('../../sfx/Kick.wav');
        this.HIT1  = new Sound('../../sfx/stomp.wav');
    }

    collides(us, them) {
        if (us.killable.dead) {
            return;
        }

        if (them.stomper) {
            if (them.vel.y > us.vel.y) {
                this.handleStomp(us, them);
            } else {
                this.handleNudge(us, them);
            }
        }
    }

    handleNudge(us, them) {
        if (this.state === STATE_WALKING) {
            them.killable.kill();
        } else if (this.state === STATE_HIDING) {
            this.KICK.play();
            this.panic(us, them);
        } else if (this.state === STATE_PANIC) {
            const travelDir = Math.sign(us.vel.x);
            const impactDir = Math.sign(us.pos.x - them.pos.x);
            if (travelDir !== 0 && travelDir !== impactDir) {
                // THIS SOUND ISNT BEHAVING CORRECTLY
                // TODO: debug
                this.BUMP.play();
                them.killable.kill();
            } else {
                this.KICK.play();
            }
        }
    }

    handleStomp(us, them) {
        if (this.state === STATE_WALKING) {
            this.HIT1.play();
            this.hide(us);
        } else if (this.state === STATE_HIDING) {
            us.killable.kill();
            us.vel.set(100, -200);
            us.solid.obstructs = false;
        } else if (this.state === STATE_PANIC) {
            this.hide(us);
        }
    }

    hide(us) {
        us.vel.x = 0;
        us.pendulumMove.enabled = false;
        if (this.walkSpeed === null) {
            this.walkSpeed = us.pendulumMove.speed;
        }
        this.hideTime = 0;
        this.state = STATE_HIDING;
    }

    unhide(us) {
        us.pendulumMove.enabled = true;
        us.pendulumMove.speed = this.walkSpeed;
        this.state = STATE_WALKING;
    }

    panic(us, them) {
        us.pendulumMove.enabled = true;
        us.pendulumMove.speed = this.panicSpeed * Math.sign(them.vel.x);
        this.state = STATE_PANIC;
    }

    update(us, deltaTime) {
        if (this.state === STATE_HIDING) {
            this.hideTime += deltaTime;
            if (this.hideTime > this.hideDuration) {
                this.unhide(us);
            }
        }
    }
}

function createKoopaFactory(sprite) {
    const walkAnim = sprite.animations.get('walk');
    const wakeAnim = sprite.animations.get('wake');

    function routeAnim(koopa) {
        if (koopa.behavior.state === STATE_HIDING) {
            if (koopa.behavior.hideTime > 3) {
                return wakeAnim(koopa.behavior.hideTime);
            }
            return 'hiding';
        }

        if (koopa.behavior.state === STATE_PANIC) {
            return 'hiding';
        }

        return walkAnim(koopa.lifetime);
    }

    function drawKoopa(context) {
        sprite.draw(routeAnim(this), context, 0, 0, this.vel.x < 0);
    }

    return function createKoopa() {
        const koopa = new Entity();
        koopa.size.set(16, 16);
        koopa.offset.y = 8;

        koopa.addTrait(new Physics());
        koopa.addTrait(new Solid());
        koopa.addTrait(new PendulumMove());
        koopa.addTrait(new Killable());
        koopa.addTrait(new Behavior());

        // add koopa death sound
        koopa.killable.setSound('../../sfx/Squish.wav');
        // add koopa sounds for first hit
        // add koopa sound for kick shell
        // add koopa sound for when shell hits stuff (enemies & objects)

        koopa.draw = drawKoopa;

        return koopa;
    };
}