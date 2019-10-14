import { Graphics, Text } from 'pixi.js';
import { DropShadowFilter } from '@pixi/filter-drop-shadow';

export default class Queue extends Graphics {
  constructor(options = {}) {
    const defaultOptions = {
      x: 300,
      y: 270,
      scene: null,
      capacity: 10,
      requestWidth: 46,
      requestHeight: 24,
    }

    const initialOptions = Object.assign({}, defaultOptions, options);

    super(initialOptions);
    Graphics.call(this);

    this._styling(initialOptions);

    this.scene = initialOptions.scene;
    this.requests = [];
    this.capacity = initialOptions.capacity;
    this.requestWidth = initialOptions.requestWidth;
    this.requestHeight = initialOptions.requestHeight;

    this.lostedNum = 0;

    this._styling(initialOptions);
  }


  enqueue(item) {
    if (this.requests.length >= this.capacity) {
      this.lostedNum += 1;
      this.textLosted.text = this.lostedNum;
    } else {
      if (this.requests.length === 0) {
        const { requestWidth } = this;

        item.x = this.x + this.width - requestWidth;
      } else {
        const last = this.requests[this.requests.length - 1];

        item.x = last.x - 15;
      }
      item.y = this.y + 6;

      this.requests.push(item);
      item.appendTo(this.scene);
    }

    return this;
  }


  dequeue() {
    if (this.requests.length > 0) {
      const first = this.requests.shift();

      this.requests.forEach((request) => { request.x += 15; });

      return first;
    }
  }


  appendTo(parent) {
    parent.addChild(this);
    return this;
  }


  prependTo(parent) {
    parent.addChildAt(this, 0);
    return this;
  }


  _styling(options) {
    const {
      x,
      y,
      capacity,
      requestWidth,
      requestHeight,
    } = options;

    this._height = requestHeight + 10;
    this._width = requestWidth + 15 * (capacity - 1);

    this
      .beginFill(0x666666)
      .drawRect(0, 0, this._width, 2)
      .endFill();

    this
      .beginFill(0x666666)
      .drawRect(0, this._height, this._width, 2)
      .endFill();

    this._addTexts()

    this.x = x;
    this.y = y;

    this.filters = [new DropShadowFilter()];
  }


  _addTexts(content) {
    const textStyle = {
      fontFamily : 'Arial',
      fontSize: 12,
      align : 'center'
    }

    let text = new Text('capacity:', textStyle);
    text.position.set(this.width - 20, -9);
    text.anchor.set(1, 0.5);
    this.addChild(text);

    this.textCapacity = new Text(this.capacity, textStyle)
    this.textCapacity.position.set(this.width, -9);
    this.textCapacity.anchor.set(1, 0.5);
    this.addChild(this.textCapacity);

    text = new Text('were lost:', textStyle);
    text.position.set(0, -9);
    text.anchor.set(0, 0.5);
    this.addChild(text);

    this.textLosted = new Text(this.lostedNum, textStyle)
    this.textLosted.position.set(55, -9);
    this.textLosted.anchor.set(0, 0.5);
    this.addChild(this.textLosted);

    return this;
  }
}