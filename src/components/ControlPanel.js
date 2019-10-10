export default class ControlPanel {
  constructor() {
    this.view = document.createElement('div')

    this.view.className = 'control-panel';
    this.view.innerHTML = `
      <div class="wrapper-buttons">
        <button class="button button_start">▶ Start</button>
        <button class="button button_stop">◾ Stop</button>
      </div>
      <div class="wrapper-controls"></div>
      <div class="wrapper-statistics"></div>
    `;

    [this.startButton] = this.view.getElementsByClassName('button_start');
    [this.stopButton] = this.view.getElementsByClassName('button_stop');

    this._state = 'stopped';
  }


  get state() {
    return this._state;
  }


  set state(value) {
    switch(value) {
      case 'started':
        this.startButton.textContent = '▮▮ Pause';
        break;
      case 'paused':
        this.startButton.textContent = '▶ Start';
        break;
      case 'stopped':
        this.startButton.textContent = '▶ Start';
        break
    }

    this._state = value;
  }
}