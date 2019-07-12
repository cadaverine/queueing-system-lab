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
    this.type = initialOptions.type;
    this._served = false;

    requestsNumber += 1;
  }


  appendTo(parent) {
    parent.addChild(this);
    return this;
  }


  prependTo(parent, zIndex) {
    parent.addChildAt(this, zIndex);
    return this;
  }


  setVelocity(velocity) {
    const { x, y } = velocity;

    if (x != null) { this.vx = x; }
    if (y != null) { this.vy = y; }
  }


  moveX() {
    this.x += this.vx;
  }


  moveY() {
    this.y += this.vy;
  }


  serve() {
    if (this.loaderLine.width === 40) {
      this.served = true;
    } else {
      // hack
      this.loaderLine.x -= 3;
      this.loaderLine.width += 1;
    }
  }


  get served() {
    return this._served;
  }


  set served(value) {
    if (value === true) {
      this.lineStyle(3, 0x16db3d, 11)
    } else {
      this.lineStyle(2, 0x777777, 10)
    }

    this._served = value;
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

    this
      .lineStyle(2, 0x777777, 10)
      .beginFill(backgroundColor)
      .drawRoundedRect(0, 0, 46, 24, 5)
      .endFill();

    this
      ._addText(type)
      ._addLoader();

    this.x = x;
    this.y = y;

    this.filters = [new DropShadowFilter()];
  }


  _addText(content) {
    const textStyle = {
      fontFamily : 'Arial',
      fontSize: 12,
      fontWeight: 'bold',
      align : 'center'
    }

    const text = new Text(content, textStyle);

    text.position.set(23, 12);
    text.anchor.set(0.5, 0.7);

    this.addChild(text);

    return this;
  }


  _addLoader() {
    this.loaderArea = new Graphics()
      .beginFill(0xdddddd)
      .drawRect(3, 17, 40, 4)
      .endFill();

    this.loaderLine = new Graphics()
      .beginFill(0x16db3d)
      .drawRect(3, 17, 1, 4)
      .endFill();

    this.addChild(this.loaderArea);
    this.loaderArea.addChild(this.loaderLine)

    return this;
  }
}