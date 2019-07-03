import Request, { getRandomRequestType } from './Request';
import { range } from '../helpers/utils';
import { Application } from 'pixi.js';


export default class App {
  constructor(parent) {
    this.app = new Application({
      width: 1600,
      height: 900,
      antialiasing: true,
      transparent: true,
      resolution: 1
    });

    parent.style.display = 'flex';
    parent.style.justifyContent = 'center';
    this.app.view.style.border = '1px solid black';

    parent.appendChild(this.app.view);

    this.requests = [];
    this.currentRequest = null;
  }

  setup() {
    this.requests = range(0, 10).map(i => new Request({
      x: 400 + 25 * i,
      y: 400,
      type: getRandomRequestType(),
    }))

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
      }
    }

    if (Math.random() > 0.99) {
      const newRequest = this.createRequest();
      this.addRequestToQueue(newRequest);
    }
  }

  moveRequest(request, step) {
    request.x += step;
  }

  createRequest(requestType) {
    const type = requestType != null ? requestType : getRandomRequestType();

    return new Request({ x: 400, y: 400, type });
  }

  addRequestToQueue(request) {
    if (this.currentRequest != null) {
      this.currentRequest.x += 25;
    }

    this.requests.forEach((request, i) => {
      request.zIndex += 1;
      request.x += 25;
    });

    request.prependTo(this.app.stage);
    this.requests.unshift(request);
  }
}
