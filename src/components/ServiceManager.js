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

    this.services = new Map();
  }


  startQueuingSystem(delta) {
    this.services.forEach(this._service.bind(this));

    const request = this.requests[this.requests.length - 1];
    const device = this._getSuitableDevice(request);

    if (request != null && device != null) {
      request.vx = 4;
      request.vy = 4;

      this.services.set(request, device);
      this.requests.splice(-1);
      device.isFree = false;
    }

    this._addRequestRandom();
  }


  reset() {
    while (this.scene.children[0]) {
      this.scene.removeChild(this.scene.children[0]);
    }

    this.devices = this._createDevices(this._options.scene);
    this.requests = this._createRequests(this._options.scene);

    this.services = new Map();
  }


  _getSuitableDevice(request) {
    if (request == null) return null;

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


  _generateRequest(requestType) {
    const type = requestType != null ? requestType : getRandomType(Request.types);

    return new Request({ x: 400, y: 280, type });
  }


  _moveRequestToDevice(request, device) {
    const slot = device.slotCoords;

    if (slot.x - request.x > 200) {
      request.x += request.vx;
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

      request.x += request.vx;
    } else {
      device.isInWork = true;
    }
  }


  _service(device, request) {
    if (!device.isInWork) {
      this._moveRequestToDevice(request, device);
    } else if (!request.served){
      request.serve();
    } else {
      device.registerOperation('service', request.type);
      this._removeRequest(request);
    }
  }


  _addRequestRandom(value = 0.96) {
    if (Math.random() > value) {
      const newRequest = this._generateRequest();
      this._addRequestToQueue(newRequest);
    }
  }


  _addRequestToQueue(request) {
    if (this.requests.length > 0) {
      const [{ zIndex }] = this.requests;

      this.requests.forEach((request, i) => {
        request.zIndex += 1;
        request.x += 15;
      });

      request.zIndex = zIndex;
    }

    request.appendTo(this.scene);

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


  _removeRequest(request) {
    const device = this.services.get(request);

    device.isFree = true
    device.isInWork = false

    this.services.delete(request);
    request.destroy();
  }
}