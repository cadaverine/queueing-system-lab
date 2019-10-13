import ServiceManager from './ServiceManager';
import ControlPanel from './ControlPanel';
import { Application } from 'pixi.js';


export default class App {
  constructor(parent) {
    this.app = new Application({
      width: 1200,
      height: 620,
      antialiasing: true,
      transparent: true,
      resolution: 1
    });

    this.panel = new ControlPanel();

    parent.appendChild(this.panel.view);
    parent.appendChild(this.app.view);

    this.app.stage.sortDirty = true;
    this.app.stage.sortableChildren = true;

    this.parent = parent
    this.manager = new ServiceManager({ scene: this.app.stage });
    this.services = new Map();
  }


  setup() {
    this.panel.startButton.onclick = () => {
      if (this.panel.state === 'started') {
        this.panel.state = 'paused';
        this.pause();
      } else {
        this.panel.state = 'started';
        this.start();
      }
    };

    this.panel.stopButton.onclick = () => {
      this.panel.state = 'stopped'
      this.pause();
      this.stop();
    };

    this.ticker = this.app.ticker.add(delta => this.manager.startQueuingSystem(delta));
    this.ticker.update();
    this.pause();
  }


  start() {
    this.ticker.start();
  }


  pause() {
    this.ticker.stop();
  }


  stop() {
    this.manager.reset();
    this.ticker.update();
    this.ticker.stop();
  }
}
