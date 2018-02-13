export default class Sound {
  constructor(src) {
    this.sound = document.createElement('audio');
    this.sound.src = src;
    this.sound.setAttribute('preload', 'auto');
    this.sound.setAttribute('controls', 'none');
    this.sound.style.display = 'none';
    this.sound.volume = 0.5;
    document.body.appendChild(this.sound);
  }

  get playing() {
    return !this.sound.paused;
  }

  play() {
    if (!this.playing) {
      // if paused, resume playback
      this.sound.play();
    } else {
      // if a sound effect, start over
      this.sound.currentTime = 0;
      this.sound.play();
    }
  }

  stop() {
    this.sound.pause();
    this.sound.currentTime = 0;
  }

  pause() {
    this.sound.pause();
  }

  setVolume(vol) {
    this.sound.volume = vol;
  }
}