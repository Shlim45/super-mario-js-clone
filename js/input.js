import Keyboard from './KeyboardState.js';

export function setupKeyboard(mario) {
  const input = new Keyboard();

  // jumping
  input.addMapping('KeyP', keyState => {
    if (keyState) {
      mario.jump.start();
    } else {
      mario.jump.cancel();
    }
  });
  input.addMapping('KeyZ', keyState => {
    if (keyState) {
      mario.jump.start();
    } else {
      mario.jump.cancel();
    }
  });
  // running
  input.addMapping('KeyO', keyState => {
    mario.turbo(keyState);
  });
  input.addMapping('ShiftLeft', keyState => {
    mario.turbo(keyState);
  });

  // movement
  input.addMapping('KeyD', keyState => {
    mario.go.dir += keyState ? 1 : -1;
  });
  input.addMapping('ArrowRight', keyState => {
    mario.go.dir += keyState ? 1 : -1;
  });

  input.addMapping('KeyA', keyState => {
    mario.go.dir += keyState ? -1 : 1;
  });
  input.addMapping('ArrowLeft', keyState => {
    mario.go.dir += keyState ? -1 : 1;
  });

  return input;
}