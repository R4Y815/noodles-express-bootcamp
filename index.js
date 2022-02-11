console.log('hello world');
import express, {request, response } from 'express';
import { read } from './jsonFileStorage.js';

const app = express();
const port = 3004;

/* tells express how to serve static files and from 'public folder' */
app.use(express.static('public'));
// Set view engine
app.set('view engine', 'ejs');

app.get('/', (_, res) => {
  read('data.json', (err, data) => {

  response.render('home', data);
  })
});

app.get('/', (req, res) => {
  read('data.json', (err, data) => {

  response.render('#', data);
  })
});

app.get('/recipes/:index', (req, res) => {
  read('data.json', (err, data) => {
    const { index } = request.params;
    const content = { index, recipe: data.recipes }
  response.render('recipe', content);
  })
});



app.listen(port,() => console.log('listening on Port:',port ));