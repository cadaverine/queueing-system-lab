import { Graphics, Text } from 'pixi.js';

let devicesNumber = 0;

export default class ServiceDevice extends Graphics {
  static get types() {
    return ['NO', 'NX'];
  }


  static get number() {
    return devicesNumber;
  }


  constructor(options = {}) {
    const defaultOptions = {
      x: 500,
      y: 500,
      type: 'NX',
      requestTypes: ['XCHG', 'CARD', 'CRED', 'ACNT']
    }

    const initialOptions = Object.assign({}, defaultOptions, options);

    super(initialOptions);
    Graphics.call(this);

    this._styling(initialOptions);

    this.id = devicesNumber;
    this.type = initialOptions.type;
    this.requestTypes = initialOptions.requestTypes;
    this.isFree = true;
    this.isInWork = false;

    devicesNumber += 1;
  }


  appendTo(parent) {
    parent.addChild(this);
    return this;
  }


  prependTo(parent) {
    parent.addChildAt(this, 0);
    return this;
  }


  clear() {
    this.destroy();
  }


  _styling(options) {
    const { x, y, type } = options;

    let backgroundColor;
    switch (type) {
      case 'NX':
        backgroundColor = 0x2686DE;
        break;
      case 'NO':
        backgroundColor = 0xF63261;
        break;
      default:
        backgroundColor = 0xFFFFFF;
    }

    this
      .beginFill(backgroundColor)
      .drawRoundedRect(0, 0, 58, 60, 0)
      .endFill();

    this
      ._addText(type)
      ._addLoader();

    this.x = x;
    this.y = y;
  }


  get slotCoords() {
    return {
      x: this.x + 4 + 2,
      y: this.y + 23 + 3,
    }
  }


  // get requestTypes() {
  //   switch(this.type) {
  //     case 'NX':
  //   }
  // }


  _addText(content) {
    const textStyle = {
      fill: 0xffffff,
      align : 'center',
      fontSize: 16,
      fontWeight: 'bold',
      fontFamily : 'Arial',
    }

    const text = new Text(content, textStyle);

    text.position.set(29, 20);
    text.anchor.set(0.5, 1);

    this.addChild(text);

    return this;
  }


  _addLoader() {
    this.slot = new Graphics()
      .beginFill(0xffffff)
      .drawRect(4, 23, 50, 30, 0)
      .endFill();

    this.addChild(this.slot);

    return this;
  }
}