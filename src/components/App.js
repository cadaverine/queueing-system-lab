import Request from './Request';
import ServiceDevice from './ServiceDevice';
import ServiceManager from './ServiceManager';
import { Application } from 'pixi.js';
import { range, getRandomType } from '../helpers/utils';


export default class App {
  constructor(parent) {
    this.app = new Application({
      width: 1200,
      height: 620,
      antialiasing: true,
      transparent: true,
      resolution: 1
    });

    parent.style.display = 'flex';
    parent.style.justifyContent = 'center';
    this.app.view.style.border = '1px solid black';

    parent.appendChild(this.app.view);

    this.manager = new ServiceManager({ scene: this.app.stage });
    this.services = new Map();
  }

  // createControlPanel() {

  // }


  setup() {
    this.ticker = this.app.ticker.add(delta => this.gameLoop(delta));
    this.ticker.stop();
  }


  start() {
    this.ticker.start();
  }


  stop() {
    this.ticker.stop();
  }


  gameLoop(delta) {
    if (this.currentRequest != null) {
      if (this.currentRequest.served === true) {
        this.services.delete(this.currentRequest);
        this.currentRequest.clear();
        this.currentRequest = null;
      } else {
        if (!this.services.has(this.currentRequest)) {
          const device = this.manager.getSuitableDevice(this.currentRequest);

          this.services.set(this.currentRequest, device);
        }

        const device = this.services.get(this.currentRequest);

        this.manager.moveRequestToDevice(this.currentRequest, device);
      }
    } else {
      if (this.manager.requests.length > 0) {
        this.currentRequest = this.manager.requests.pop()
        this.currentRequest.setVelocity({
          y: 3 + delta,
          x: 3 + delta,
        })
      }
    }

    if (Math.random() > 0.99) {
      const newRequest = this.manager.generateRequest();
      this.manager.addRequestToQueue(newRequest);
    }
  }
}
