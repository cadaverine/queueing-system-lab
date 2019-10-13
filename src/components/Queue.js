import { Graphics, Text } from 'pixi.js';
import { DropShadowFilter } from '@pixi/filter-drop-shadow';

export default class Queue extends Graphics {
  constructor(options = {}) {
    const defaultOptions = {
      x: 370,
      y: 270,
      capacity: 10,
      requestWidth: 46,
      requestHeight: 24,
    }

    const initialOptions = Object.assign({}, defaultOptions, options);

    super(initialOptions);
    Graphics.call(this);

    this._styling(initialOptions);

    this.requests = [];
    this.capacity = initialOptions.capacity;
    this.requestWidth = initialOptions.requestWidth;
    this.requestHeight = initialOptions.requestHeight;
  }


  enqueue(item) {
    if (this.requests.length === 0) {
      const { requestWidth } = this;

      item.x = this.x + this.width - requestWidth;
    } else {
      const last = this.requests[this.requests.length - 1];

      item.x = last.x - 15;
    }
    item.y = this.y + 6;

    this.requests.push(item);

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
    this._width = requestWidth + 17 * (capacity - 1);

    this
      .beginFill(0x666666)
      .drawRect(0, 0, this._width, 2)
      .endFill();

    this
      .beginFill(0x666666)
      .drawRect(0, this._height, this._width, 2)
      .endFill();

    // this
    //   ._addText(type)
    //   ._addLoader();

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
}