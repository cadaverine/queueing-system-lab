import Request from './Request';
import ServiceDevice from './ServiceDevice';
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

    this.requests = [];
    this.devicesTypes = ['NO', 'NO', 'NX', 'NX', 'NX', 'NX', 'NX'];
    this.currentRequest = null;
  }


  setup() {
    this.requests = range(0, 10).map(i => new Request({
      x: 400 + 15 * i,
      y: 280,
      type: getRandomType(Request.types),
    }))

    this.devices = this.devicesTypes.map((type, i) => new ServiceDevice({
      x: 1000,
      y: 50 + 75 * i,
      type,
    }))

    this.devices.forEach(request => request.appendTo(this.app.stage));
    this.requests.forEach(request => request.appendTo(this.app.stage));
  }


  start() {
    this.app.ticker.add(delta => this.gameLoop(delta));
  }


  gameLoop(delta) {
    if (this.currentRequest != null) {
      if (this.currentRequest.x >= 1200) {
        this.currentRequest.clear()
        this.currentRequest = null;
      } else {
        this.moveRequest(this.currentRequest, 3 + delta);
      }
    } else {
      if (this.requests.length > 0) {
        this.currentRequest = this.requests.pop()
        this.setRequestVelocity(this.currentRequest, {
          y: 0,
          x: 3 + delta,
        });
      }
    }

    if (Math.random() > 0.99) {
      const newRequest = this.createRequest();
      this.addRequestToQueue(newRequest);
    }
  }


  setRequestVelocity(request, { x, y }) {
    request.vx = x;
    request.vy = y;
  }


  moveRequest(request, step) {
    request.x += request.vx;
    request.y += request.vy;
  }


  createRequest(requestType) {
    const type = requestType != null ? requestType : getRandomType(Request.types);

    return new Request({ x: 400, y: 280, type });
  }


  addRequestToQueue(request) {
    this.requests.forEach((request, i) => {
      request.zIndex += 1;
      request.x += 15;
    });

    request.prependTo(this.app.stage);
    this.requests.unshift(request);
  }
}
