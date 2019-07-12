import Request from './Request';
import ServiceDevice from './ServiceDevice';
import { range, getRandomType } from '../helpers/utils';


export default class ServiceManager {
  constructor(options = {}) {
    const defaultOptions = {
      scene: null,
      queueNum: 1,
      requestsNum: 10,
      serviceDevices: [
        { type: 'NX', requestTypes: ['XCHG'] },
        { type: 'NX', requestTypes: ['XCHG'] },
        { type: 'NO', requestTypes: ['CARD', 'CRED'] },
        { type: 'NO', requestTypes: ['CARD', 'CRED'] },
        { type: 'NO', requestTypes: ['CARD', 'CRED'] },
        { type: 'NO', requestTypes: ['ACNT', 'CRED'] },
        { type: 'NO', requestTypes: ['ACNT', 'CRED'] },
      ],
    }

    this._options = Object.assign({}, defaultOptions, options);

    if (this._options.scene == null) {
      throw Error('ServiceManager: "scene" is required');
    }

    this.scene = this._options.scene;
    this.devices = this._createDevices(this._options.scene);
    this.requests = this._createRequests(this._options.scene);

    this.currentDevice = null;
    this.currentRequest = null;
  }


  getSuitableDevice(request) {
    const suitableDevices = this.devices
      .filter(device => device.isFree)
      .filter(device => device.requestTypes.includes(request.type));

    if (suitableDevices.length > 0) {
      const randomIndex = Math.round(Math.random() * (suitableDevices.length - 1));

      return suitableDevices[randomIndex];
    } else {
      return null;
    }
  }


  generateRequest(requestType) {
    const type = requestType != null ? requestType : getRandomType(Request.types);

    return new Request({ x: 400, y: 280, type });
  }


  moveRequestToDevice(request, device) {
    const slot = device.slotCoords;

    if (slot.x - request.x > 200) {
      request.moveX();
    } else if (slot.y !== request.y) {
      if (Math.abs(slot.y - request.y) < Math.abs(request.vy)) {
        request.vy = Math.abs(slot.y - request.y);
      }

      if (slot.y - request.y < 0) {
        request.y -= request.vy;
      } else {
        request.y += request.vy;
      }
    } else if (slot.x !== request.x) {
      if (Math.abs(slot.x - request.x) <= request.vx) {
        request.vx = slot.x - request.x;
      }

      request.moveX();
    } else {
      request.serve();
    }
  }


  addRequestToQueue(request) {
    const { zIndex } = this.requests[0];

    this.requests.forEach((request, i) => {
      request.zIndex += 1;
      request.x += 15;
    });

    request.appendTo(this.scene);
    request.zIndex = zIndex;

    this.scene.children.forEach(child => child.updateTransform());
    this.requests.unshift(request);
  }


  _createDevices(scene) {
    return this._options.serviceDevices.map((options, i) => new ServiceDevice({
      x: 1000,
      y: 50 + 75 * i,
      type: options.type,
      requestTypes: options.requestTypes,
    }).prependTo(scene))
  }


  _createRequests(scene) {
    return range(0, this._options.requestsNum).map(i => new Request({
      x: 400 + 15 * i,
      y: 280,
      type: getRandomType(Request.types),
    }).appendTo(scene))
  }
}