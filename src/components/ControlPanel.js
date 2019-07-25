export default class ControlPanel {
  constructor() {
    this.view = document.createElement('div');
    this.view.className = 'control-panel';

    this.startButton = document.createElement('button');
    this.startButton.textContent = 'Start';
    this.startButton.className = 'button button_start';

    this.pauseButton = document.createElement('button');
    this.pauseButton.textContent = 'Pause';
    this.pauseButton.className = 'button button_pause';

    this.view.append(this.startButton, this.pauseButton);
  }
}