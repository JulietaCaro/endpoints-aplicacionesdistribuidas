const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

const categorias = [
    {
        id: 1,
        catName: "Entradas",
        FoodItem: [
            {
                itemId: 1,
                foodName: "Papas Fritas",
                price: 800,
                photos: ["papas.jpg"],
                ingredients: [],
                celiac: true,
                vegan: true,
                isDessert: false
            },
            {
                id: 2,
                foodName: "Rabas a la provenzal",
                price: 1600,
                photos: [],
                ingredients: ["rabas", "provenzal"],
                celiac: false,
                vegan: false,
                isDessert: false
            }
        ]
    },

    {
        id: 2,
        catName: "Bebidas",
        DrinkItem: {
            drinkId: 1,
            drinkName: "Agua sin gas 500ml",
            price: 300
        },
        DrinkItem: {
            id: 2,
            drinkName: "Agua con gas 500ml",
            price: 300
        }
    }
];

app.get('/api/v1/restaurants/1/menues/categories', (req, res) => {
    res.send(categorias);
});

app.get('/api/v1/restaurants/1/menues/categories/:id', (req, res) => {
    const cat = categorias.find(c => c.id === parseInt(req.params.id));
    if(!cat) return res.status(404).send("La categoría no se encontró");
    res.send(cat);
});

app.post('/api/v1/restaurants/1/menues/categories', (req, res) => {
    const {error} = validateCategoria(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const categoria = {
        id: categorias.length + 1,
        catName: req.body.catName,
        FoodItem: 
        {
            id: req.body.FoodItem.id,
            foodName: req.body.FoodItem.foodName,
            price: req.body.FoodItem.price,
            photos: req.body.FoodItem.photos,
            ingredients: req.body.FoodItem.ingredients,
            celiac: req.body.FoodItem.celiac,
            vegan: req.body.FoodItem.vegan,
            isDessert: req.body.FoodItem.isDessert
        }
    };
    categorias.push(categoria);
    res.send(categoria);
});

app.put('/api/v1/restaurants/1/menues/categories/:id', (req, res) => {
    const cat = categorias.find(c => c.id === parseInt(req.params.id));
    if(!cat) return res.status(400).send("La categoría no se encontró");

    const {error} = validateCategoria(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    cat.catName = req.body.catName;
    cat.itemComida.nombre = req.body.itemComida.nombre;
    cat.itemComida.price = req.body.itemComida.price;
    cat.itemComida.photos = req.body.itemComida.photos;
    cat.itemComida.ingredients = req.body.itemComida.ingredients;
    cat.itemComida.celiac = req.body.itemComida.celiac;
    cat.itemComida.vegan = req.body.itemComida.vegan;
    cat.itemComida.isDessert = req.body.itemComida.isDessert;

    res.send(cat);
});

//FUNCIONA
app.delete('/api/v1/restaurants/1/menues/categories/:id', (req, res) => {
    const cat = categorias.find(c => c.id === parseInt(req.params.id));
    if(!cat) return res.status(400).send("La categoría no se encontró");

    const index = categorias.indexOf(cat);
    categorias.slice(index, 1);

    res.send(cat);
});

function validateCategoria(cat){
    const schema = {
        nombre: Joi.string().min(2).required(),
        itemComida: Joi.object().pattern(/.*/, [Joi.number(), Joi.string(), Joi.array().items(Joi.string()), Joi.array().items(Joi.string()), Joi.boolean(), Joi.boolean(), Joi.boolean()])
    };

    return Joi.validate(cat, schema);
};

app.listen(port, () => console.log(`Listening on port ${port}`));