const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

const menues = [
    {
        id: 1,
        Category: [
            {
                id: 1,
                catName: "Entradas",
                FoodItem: [
                    {
                        id: 1,
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
                        foodName: "Rabas a la Provenzal",
                        price: 1600,
                        photos: [],
                        ingredients: [],
                        celiac: false,
                        vegan: false,
                        isDessert: false
                    }
                ]
            },

            {
                id: 2,
                Category: {
                    id: 2,
                    catName: "Postres",
                    FoodItem: [
                        {
                            id: 3,
                            foodName: "Brownie con Helado",
                            price: 750,
                            photos: ["brownie.jpg", "helado.jpg"],
                            ingredients: ["huevo", "manteca", "chocolate"],
                            celiac: false,
                            vegan: false,
                            isDessert: true
                        },

                        {
                            id: 4,
                            foodName: "Ensalada de Frutas",
                            price: 600,
                            photos: [],
                            ingredients: [],
                            celiac: true,
                            vegan: true,
                            isDessert: true
                        }
                    ]
                }
            }
        ]
    },

    {
        id: 2,
        Category: [
            {
                id: 3,
                catName: "Pastas",
                FoodItem: [
                    {
                        id: 1,
                        foodName: "Fideos con Bolognesa",
                        price: 1450,
                        photos: [],
                        ingredients: [],
                        celiac: false,
                        vegan: false,
                        isDessert: false
                    },

                    {
                        id: 2,
                        foodName: "Ñoquis de Papa con Fileto",
                        price: 1230,
                        photos: [],
                        ingredients: [],
                        celiac: false,
                        vegan: false,
                        isDessert: false
                    }
                ]
            }
        ]
    },

    {
        id: 9,
        Category:
        {
            id: 1,
            catName: "Ensaladas",
            FoodItem: {
                id: 1,
                foodName: "Ensalada Rusa",
                price: 650,
                photos: [],
                ingredients: [],
                celiac: true,
                vegan: true,
                isDessert: false
            }
        }
    }
];

app.get('/api/v1/restaurants/1/menues', (req, res) => {
    res.send(menues);
});

/*
app.get('/api/v1/menues/:id', (req, res) => {
    const menu = menues.find(m => m.id === parseInt(req.params.id));
    if(!menu) return res.status(404).send("El menú no se encontró");
    res.send(menu);
});*/

app.post('/api/v1/restaurants/1/menues', (req, res) => {
    const { error } = validateMenu(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const menu = {
        id: menues.length + 1,
        Category: {
            id: req.body.Category.id,
            catName: req.body.Category.catName,
            FoodItem: 
                {
                    id: req.body.Category.FoodItem.id,
                    foodName: req.body.Category.FoodItem.foodName,
                    price: req.body.Category.FoodItem.price,
                    photos: req.body.Category.FoodItem.photos,
                    ingredients: req.body.Category.FoodItem.ingredients,
                    celiac: req.body.Category.FoodItem.celiac,
                    vegan: req.body.Category.FoodItem.vegan,
                    isDessert: req.body.Category.FoodItem.isDessert
                }
        }
    };
    menues.push(menu);
    res.send(menu);
});

app.put('/api/v1/restaurants/1/menues/:id', (req, res) => {
    const menu = menues.find(m => m.id === parseInt(req.params.id));
    if(!menu) return res.status(400).send("El menú no se encontró");

    const { error } = validateMenu(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    menu.Category.catName = req.body.Category.catName;
    menu.Category.FoodItem.foodName = req.body.Category.FoodItem.foodName;
    menu.Category.FoodItem.price = req.body.Category.FoodItem.price;
    menu.Category.FoodItem.photos = req.body.Category.FoodItem.photos;
    menu.Category.FoodItem.ingredients = req.body.Category.FoodItem.ingredients;
    menu.Category.FoodItem.celiac = req.body.Category.FoodItem.celiac;
    menu.Category.FoodItem.vegan = req.body.Category.FoodItem.vegan;
    menu.Category.FoodItem.isDessert = req.body.Category.FoodItem.isDessert;

    res.send(menu);
});

app.delete('/api/v1/restaurants/1/menues/:id', (req, res) => {
    const menu = menues.find(m => m.id === parseInt(req.params.id));
    if(!menu) return res.status(400).send("El menú no se encontró");

    const index = menues.indexOf(menu);
    menues.slice(index, 1);

    res.send(menu);
});

function validateMenu(menu){
    const schema = {
        Category: Joi.object().pattern(/.*/, [Joi.number(), Joi.string().required(), Joi.object().pattern(/.*/, [Joi.string(), Joi.number(), Joi.array().items(Joi.string()), Joi.array().items(Joi.string()), Joi.boolean(), Joi.boolean(), Joi.boolean()])]).required()
    };

    return Joi.validate(menu, schema);
};

app.listen(port, () => console.log(`Listening on port ${port}`));