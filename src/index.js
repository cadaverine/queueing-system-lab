import './css/styles.css';
import App from './components/App';

const container = document.createElement('div');
container.className = 'container';
document.body.appendChild(container);

const app = new App(container);

app.setup();
app.start();
