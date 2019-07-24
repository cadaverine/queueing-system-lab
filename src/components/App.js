import ServiceManager from './ServiceManager';
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

    parent.appendChild(this.app.view);

    this.app.stage.sortDirty = true;
    this.app.stage.sortableChildren = true;

    this.parent = parent
    this.manager = new ServiceManager({ scene: this.app.stage });
    this.services = new Map();
  }


  setup() {
    this.ticker = this.app.ticker.add(delta => this.manager.startQueuingSystem(delta));
    this.ticker.stop();
  }


  start() {
    this.ticker.start();
  }


  stop() {
    this.ticker.stop();
  }
}
