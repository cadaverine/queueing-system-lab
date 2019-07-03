import Request, { getRandomRequestType } from './Request';
import { range } from './utils';
import { Application } from 'pixi.js';


// class App {
//   constructor(parent) {
//     this.app = new Application({
//       width: 1600,
//       height: 900,
//       antialiasing: true,
//       transparent: true,
//       resolution: 1
//     });

//     parent.style.display = 'flex';
//     parent.style.justifyContent = 'center';
//     app.view.style.border = '1px solid black';

//     parent.appendChild(app.view);

//     this.reaquests = [];
//     this.currentRequest = null;
//   }

//   setup() {
//     this.requests = range(0, 10).map(i => new Request({
//       x: 400 + 25 * i,
//       y: 400,
//       type: getRandomRequestType(),
//     }))

//     this.requests.forEach(request => request.appendTo(app.stage));
//   }

//   start() {
//     this.app.ticker.add(this.gameLoop)
//   }
// }



const app = new Application({
  width: 1600,
  height: 900,
  antialiasing: true,
  transparent: true,
  resolution: 1
});

document.body.style.display = 'flex';
document.body.style.justifyContent = 'center';
app.view.style.border = '1px solid black';

document.body.appendChild(app.view);


let requests = [];

function setup() {
  requests = range(0, 10).map(i => new Request({
    x: 400 + 25 * i,
    y: 400,
    type: getRandomRequestType(),
  }))

  requests.forEach(request => request.appendTo(app.stage));

  app.ticker.add(gameLoop)
}

setup();

function moveToServiceDevice(request) {

}

let request = null;
function gameLoop(delta) {
  if (request != null) {
    if (request.x >= 1200) {
      request.clear()
      request = null;
    } else {
      request.x += 2 + delta;
    }
  } else {
    if (requests.length > 0) {
      request = requests.pop()
    }
  }
}