import express, {request, response} from 'express';
import { read, } from './jsonFileStorage.js';
const app = express();
const port = 3004;

app.use(express.json());


/* FN: to replace all the '/n' inside values of 'ingredients' keys with '<br>' and then return a new string to display */
let tempIngredient;
const replaceSlashN = (jsObject) => {
  const lines = jsObject.ingredients.split('\n');
  const newString = lines.join("<br>");
return newString;
};



/* generate Recipe HTML*/
/* can use this function to call in replace slashN function to transform the ingredients key */
const genRecipeHTML = (jsObject) => {
  const {
    source,
    label,
    url,
    serving,
    caution,
    image,
    category
  } = jsObject;

const ingredientsDisplay = replaceSlashN(jsObject);
  
return `
        <div>
        <div><b>Source:</b> ${source}</div>
        <div><b>Name:</b> ${label}</div>
        <div><b>URL:</b></div>
        <a href = "${url}">${url}</a>
        <p></p>
        <div><b>Ingredients:</b><br>${ingredientsDisplay}</div>
        <p></p>
        <div><b>Servings</b> ${serving}</div>
        <p></p>
        <div><b>Food Allergy Warnings:</b> ${caution}</div>
        <p></p>
        <img src ="${image}">
        <p></p>
        <div><b>Category</b> ${category}</div>
        </div>
       `;
}


app.get('/recipe/:index', (req, res) => {
  read ('data.json', (err,data) => {
    const { index } = req.params;
    if (data.recipes == null || index >= data.recipes.length ) {
      res.status(404).send('Sorry, we do not have the recipe index or recipe you are asking for.');
      return;
    }
    const content = genRecipeHTML(data.recipes[index]);
    res.send(`
         <html>
        <body>
          <h3>Recipe#${index}</h3>
          ${content}
        </body>
      </html>
    `);
  })
});




app.get('/yield/:servingSize', (req, res) => {
read('data.json', (err,data) => {
  const { servingSize } = req.params;
/* 
      if (data.recipes == null || index >= data.recipes.length ) {
      res.status(404).send('Sorry, we do not have the recipe index or recipe you are asking for.');
      return;
    } */
    const jsObjects = data.recipes.filter((recipe) => recipe.serving.toString() === servingSize.toString());
    console.log(jsObjects);
    res.send(`
      <html>
        <body>
          ${jsObjects.map(genRecipeHTML)}
        </body>
      </html>
    `);
  });
});


app.listen(port,() => console.log("listening on Port:",port ));