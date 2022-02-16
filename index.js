import express, {request, response } from 'express';
import cookieParser from 'cookie-parser';
import { read } from './jsonFileStorage.js';


const app = express();
const port = 3004;


app.use(express.urlencoded({ extended: false }));

/* tells express how to serve static files and from 'public folder' */
app.use(express.static('public'));

/* import Cookie Parser */
app.use(cookieParser());

// Set view engine
app.set('view engine', 'ejs');

/* FN: to replace all the '/n' inside values of 'ingredients' keys with '<br>' and then return a new string to display */
/* const replaceSlashN = (jsObject, index) => {
  const lines = jsObject.recipes[index].ingredients.split('\n'); */
  /* const newString = lines.join("<br>"); */
/* return lines;
}; */

app.get('/', (req, res) => {
  console.log('Cookies: ', req.cookies)
  const  favIndex  = req.cookies.favourite;
  console.log('favIndex =', favIndex);
  read('data.json', (err, data) => {
  const recipes = {favIndex: favIndex, recipe: data.recipes};
  res.render('glossary', recipes);
  })
});

/* app.get('/', (req, res) => {
  read('data.json', (err, data) => {

  response.render('#', data);
  })
}); */

const someRoute = '/favourites';

app.get('/recipes/:index', (req, res) => {
  read('data.json', (err, data) => {
    const { index } = req.params;
    const content = { index, favPath: someRoute, recipe: data.recipes[index] };
/*     const components = replaceSlashN(data, index);
    console.log(components);
    const contentEx = { index, recipe: data.recipes[index], components} */
  res.render('recipe', content);
  })
});


app.post(someRoute, (req,res) => {
const { index } = req.body;
console.log('req.body= ',req.body);
console.log('index =', index);
const inDx = JSON.parse(JSON.stringify(req.body));
console.log('inDx', inDx);
const indice = inDx.favourite;
console.log('indice =', indice);
res.cookie('favourite',`${indice}`);
res.redirect(301, `http://localhost:${port}/recipes/${indice}`);
});


app.listen(port,() => console.log('listening on Port:',port ));