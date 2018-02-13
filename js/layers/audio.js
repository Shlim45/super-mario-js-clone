export function createAudioLayer(level, sounds) {
  const buffer = document.createElement('audio');

  return function initAudioLayer() {
    const music = {};
    sounds.forEach(file => {
      music[file.name] = file.file;
    });
    
    buffer.src = music.theme;
    buffer.play();
  }
}