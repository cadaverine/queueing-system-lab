import { Graphics, Text } from 'pixi.js';
import { DropShadowFilter } from '@pixi/filter-drop-shadow';

let requestsNumber = 0;

export default class Request extends Graphics {
  static get types() {
    return ['XCHG', 'CARD', 'CRED', 'ACNT'];
  }

  static get number() {
    return requestsNumber;
  }

  constructor(options = {}) {
    const defaultOptions = {
      x: 500,
      y: 500,
      type: 'XCHG',
    }

    const initialOptions = Object.assign({}, defaultOptions, options);

    super(initialOptions);
    Graphics.call(this);

    this._styling(initialOptions);

    this.id = requestsNumber;
    requestsNumber += 1;
  }

  appendTo(parent) {
    parent.addChild(this);
  }

  prependTo(parent) {
    parent.addChildAt(this, 0);
  }

  clear() {
    this.destroy();
  }

  _styling(options) {
    const { x, y, type } = options;

    let backgroundColor;
    switch (type) {
      case 'XCHG':
        backgroundColor = 0x40DC91;
        break;
      case 'CARD':
        backgroundColor = 0x54B7FF;
        break;
      case 'CRED':
        backgroundColor = 0x724EFF;
        break;
      case 'ACNT':
        backgroundColor = 0xFD5D5D;
        break;
      default:
        backgroundColor = 0xFFFFFF;
    }

    this.lineStyle(2, 0x777777, 10);
    this.beginFill(backgroundColor);
    this.drawRoundedRect(20, 20, 100, 50, 10);
    this.endFill();

    const textStyle = {
      fontFamily : 'Arial',
      fontSize: 24,
      fill : "white",
      align : 'right'
    }
    const text = new Text(type, textStyle);
    text.position.set(70, 45);
    text.anchor.set(0.5, 0.5);

    this.addChild(text);

    this.x = x;
    this.y = y;

    this.filters = [new DropShadowFilter()];
  }
}