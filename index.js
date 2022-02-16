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

app.get('/', (req, res) => {
  console.log('Cookies: ', req.cookies)
  const  favIndex  = req.cookies.favourite;
  console.log('favIndex =', favIndex);
  read('data.json', (err, data) => {
  const recipes = {favIndex: favIndex, recipe: data.recipes};
  res.render('glossary', recipes);
  })
});


const routeToSetFavouriteInCookie = '/favourites';

app.get('/recipes/:index', (req, res) => {
  read('data.json', (err, data) => {
    const { index } = req.params;
    const content = { index, favPath: routeToSetFavouriteInCookie, recipe: data.recipes[index] };
  res.render('recipe', content);
  })
});


app.post(routeToSetFavouriteInCookie, (req,res) => {
const indice = req.body.favourite;
console.log('indice =', indice);
res.cookie('favourite',`${indice}`);
res.redirect(301, `recipes/${indice}`);
});


app.listen(port,() => console.log('listening on Port:',port ));