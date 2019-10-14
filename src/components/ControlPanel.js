export default class ControlPanel {
  constructor() {
    this.view = document.createElement('div')

    this.view.className = 'control-panel';
    this.view.innerHTML = `
      <div class="wrapper-buttons">
        <button class="button button_start">▶  Start</button>
        <button class="button button_stop">■  Stop</button>
      </div>
      <div class="wrapper-controls">
        <div class="column-card">
          <button class="button add-card">ADD CARD</button>
        </div>
        <div class="column-cred">
          <button class="button add-cred">ADD CRED</button>
        </div>
        <div class="column-acnt">
          <button class="button add-acnt">ADD ACNT</button>
        </div>
        <div class="column-xchg">
          <button class="button add-xchg">ADD XCHG</button>
        </div>
      </div>
      <div class="wrapper-statistics"></div>
    `;

    [this.startButton] = this.view.getElementsByClassName('button_start');
    [this.stopButton] = this.view.getElementsByClassName('button_stop');

    [this.cardButton] = this.view.getElementsByClassName('add-card');
    [this.credButton] = this.view.getElementsByClassName('add-cred');
    [this.acntButton] = this.view.getElementsByClassName('add-acnt');
    [this.xchgButton] = this.view.getElementsByClassName('add-xchg');

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