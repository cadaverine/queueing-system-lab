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

    this.devices = this._createDevices(this._options.scene);
    this.requests = this._createRequests(this._options.scene);

    this.currentDevice = null;
    this.currentRequest = null;
  }


  getSuitableDevice(request) {
    const device = this.devices
      .filter(device => device.isFree)
      .filter(device => device.requestTypes.includes(request.type))
      .slice(0, 1)

    return device;
  }


  generateRequest(requestType) {
    const type = requestType != null ? requestType : getRandomType(Request.types);

    return new Request({ x: 400, y: 280, type });
  }


  _createDevices(scene) {
    return this._options.serviceDevices.map((options, i) => new ServiceDevice({
      x: 1000,
      y: 50 + 75 * i,
      type: options.type,
      requestTypes: options.requestTypes,
    }).appendTo(scene))
  }


  _createRequests(scene) {
    return range(0, this._options.requestsNum).map(i => new Request({
      x: 400 + 15 * i,
      y: 280,
      type: getRandomType(Request.types),
    }).appendTo(scene))
  }
}