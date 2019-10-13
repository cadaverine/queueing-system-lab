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
      requestTypes: ['XCHG', 'CARD', 'CRED', 'ACNT'],
      textStyle: {
        fill: 0xffffff,
        align : 'center',
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily : 'Arial',
      },
    }

    const initialOptions = Object.assign({}, defaultOptions, options);

    super(initialOptions);
    Graphics.call(this);

    this.id = devicesNumber;
    this.type = initialOptions.type;
    this.requestTypes = initialOptions.requestTypes;
    this.isFree = true;
    this.isInWork = false;
    this.statistics = {};
    this.statisticsTexts = {};

    devicesNumber += 1;

    this._styling(initialOptions);
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
    const {
      x,
      y,
      type,
      textStyle,
      requestTypes,
    } = options;

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
      .drawRoundedRect(0, 0, 190, 65, 0)
      .endFill();

    this
      ._addText(type, textStyle)
      ._addStatistics(requestTypes, textStyle)
      ._addLoader();

    this
      .beginFill(0xeeeeee)
      .drawRect(104, 3, 1, 59)
      .endFill();

    this
      .beginFill(0xeeeeee)
      .drawRect(145, 3, 1, 59)
      .endFill();

    this
      .beginFill(0xeeeeee)
      .drawRect(60, 47, 125, 1)
      .endFill();

    this.x = x;
    this.y = y;
  }


  get slotCoords() {
    return {
      x: this.x + 4 + 2,
      y: this.y + 23 + 3,
    }
  }


  registerOperation(operationType, requestType) {
    const typeStat = this.statisticsTexts[requestType];
    const summStat = this.statisticsTexts['summary'];

    typeStat[operationType].text = Number(typeStat[operationType].text) + 1
    summStat[operationType].text = Number(summStat[operationType].text) + 1

    return this;
  }


  _addStatistics(requestTypes, textStyle) {
    const typesText = new Text('Types:', textStyle);
    typesText.position.set(82, 17);
    typesText.anchor.set(0.5, 1);
    this.addChild(typesText);

    const servedText = new Text('Serv.:', textStyle);
    servedText.position.set(125, 17);
    servedText.anchor.set(0.5, 1);
    this.addChild(servedText);

    const declinedText = new Text('Decl.:', textStyle);
    declinedText.position.set(165, 17);
    declinedText.anchor.set(0.5, 1);
    this.addChild(declinedText);

    requestTypes
      .forEach((type, i) => {
        const typeText = new Text(type, { ...textStyle, ...{ fontWeight: '' }});
        typeText.position.set(82, 33 + i * 14);
        typeText.anchor.set(0.5, 1);
        this.addChild(typeText);

        const typeTextServed = new Text(0, { ...textStyle, ...{ fontWeight: '' }});
        typeTextServed.position.set(125, 33 + i * 14);
        typeTextServed.anchor.set(0.5, 1);
        this.addChild(typeTextServed);

        const typeTextRejected = new Text(0, { ...textStyle, ...{ fontWeight: '' }});
        typeTextRejected.position.set(165, 33 + i * 14);
        typeTextRejected.anchor.set(0.5, 1);
        this.addChild(typeTextRejected);

        this.statisticsTexts[type] = {
          service: typeTextServed,
          rejection: typeTextRejected,
        }
      });

    const summaryText = new Text('Sum.:', textStyle);
    summaryText.position.set(85, 63);
    summaryText.anchor.set(0.5, 1);
    this.addChild(summaryText);

    const summaryTextServed = new Text(0, { ...textStyle, ...{ fontWeight: '' }});
    summaryTextServed.position.set(125, 63);
    summaryTextServed.anchor.set(0.5, 1);
    this.addChild(summaryTextServed);

    const summaryTextRejected = new Text(0, { ...textStyle, ...{ fontWeight: '' }});
    summaryTextRejected.position.set(165, 63);
    summaryTextRejected.anchor.set(0.5, 1);
    this.addChild(summaryTextRejected);

    this.statisticsTexts['summary'] = {
      service: summaryTextServed,
      rejection: summaryTextRejected,
    }

    return this;
  }


  _addText(content, textStyle) {
    const text = new Text(content, { ...textStyle, ...{ fontSize: 16 }});

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