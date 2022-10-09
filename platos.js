const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

const itemComidas = [
    {
        id: 1,
        nombre: "Cafe con leche + 3 medialunas",
        precio: 550,
        fotos: [],
        ingredientes: ["cafe", "leche", "medialunas"],
        aptoCeliaco: false,
        aptoVegano: false,
        esPostre: false
    },

    {
        id: 2,
        nombre: "Hamburgesa triple con papas fritas",
        precio: 1500,
        fotos: ["hamburguesa.jpg"],
        ingredientes: [],
        aptoCeliaco: false,
        aptoVegano: true,
        esPostre: false
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
        nombre: req.body.nombre,
        precio: req.body.precio,
        fotos: req.body.fotos,
        ingredientes: req.body.ingredientes,
        aptoCeliaco: req.body.aptoCeliaco,
        aptoVegano: req.body.aptoVegano,
        esPostre: req.body.esPostre
    };
    itemComidas.push(item);
    res.send(item);
});

app.put('/api/v1/restaurants/1/menues/categories/1/dishes/:id', (req, res) => {
    const item = itemComidas.find(i => i.id === parseInt(req.params.id));
    if(!item) return res.status(400).send("El item de la categoría no se encontró");

    const { error} = validateItem(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    item.nombre = req.body.nombre;
    item.precio = req.body.precio;
    item.fotos = req.body.fotos;
    item.ingredientes = req.body.ingredientes;
    item.aptoCeliaco = req.body.aptoCeliaco;
    item.aptoVegano = req.body.aptoVegano;
    item.esPostre = req.body.esPostre;

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
        nombre: Joi.string().min(3).required(),
        precio: Joi.number().required(),
        fotos: Joi.array().items(Joi.string()).optional(),
        ingredientes: Joi.array().items(Joi.string()).optional(),
        aptoCeliaco: Joi.boolean().required(),
        aptoVegano: Joi.boolean().required(),
        esPostre: Joi.boolean().required()
    };

    return Joi.validate(item, schema);
};

app.listen(port, () => console.log(`Listening on port ${port}`));