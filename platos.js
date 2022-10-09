const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

const itemComidas = [
    {
        id: 1,
        name: "Cafe con leche + 3 medialunas",
        price: 550,
        photos: [],
        ingredients: ["cafe", "leche", "medialunas"],
        celiac: false,
        vegan: false,
        isDessert: false
    },

    {
        id: 2,
        name: "Hamburgesa triple con papas fritas",
        price: 1500,
        photos: ["hamburguesa.jpg"],
        ingredients: [],
        celiac: false,
        vegan: true,
        isDessert: false
    }
];

app.get('/api/v1/restaurants/1/menues/categories/1/dishes', (req, res) => {
    res.send(itemComidas);
});

app.get('/api/v1/restaurants/1/menues/categories/1/dishes/:id', (req, res) => {
    const item = itemComidas.find(i => i.id === parseInt(req.params.id));
    if(!item) return res.status(404).send("El item de la categoria no se encontró");
    res.send(item);
});

app.post('/api/v1/restaurants/1/menues/categories/1/dishes', (req, res) => {
    const { error } = validateItem(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const item = {
        id: itemComidas.length + 1,
        name: req.body.name,
        price: req.body.price,
        photos: req.body.photos,
        ingredients: req.body.ingredients,
        celiac: req.body.celiac,
        vegan: req.body.vegan,
        isDessert: req.body.isDessert
    };
    itemComidas.push(item);
    res.send(item);
});

app.put('/api/v1/restaurants/1/menues/categories/1/dishes/:id', (req, res) => {
    const item = itemComidas.find(i => i.id === parseInt(req.params.id));
    if(!item) return res.status(400).send("El item de la categoría no se encontró");

    const { error} = validateItem(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    item.name = req.body.name;
    item.price = req.body.price;
    item.photos = req.body.photos;
    item.ingredients = req.body.ingredients;
    item.celiac = req.body.celiac;
    item.vegan = req.body.vegan;
    item.isDessert = req.body.isDessert;

    res.send(item);
});

//FUNCIONA
app.delete('/api/v1/restaurants/1/menues/categories/1/dishes/:id', (req, res) => {
    const item = itemComidas.find(i => i.id === parseInt(req.params.id));
    if(!item) return res.status(400).send("El item de la categoría no se encontró");

    const index = itemComidas.indexOf(item);
    itemComidas.slice(index, 1);

    res.send(item);
});

function validateItem(item){
    const schema = {
        name: Joi.string().min(3).required(),
        price: Joi.number().required(),
        photos: Joi.array().items(Joi.string()).optional(),
        ingredients: Joi.array().items(Joi.string()).optional(),
        celiac: Joi.boolean().required(),
        vegan: Joi.boolean().required(),
        isDessert: Joi.boolean().required()
    };

    return Joi.validate(item, schema);
};

app.listen(port, () => console.log(`Listening on port ${port}`));