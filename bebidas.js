const Joi = require('joi');
const express = require('express');
const func = require('joi/lib/types/func');
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

const itemBebidas = [
    {
        id: 1,
        nombre: "Cerveza Quilmes",
        precio: 560
    },

    {
        id: 2,
        nombre: "Coca Cola 500ml",
        precio: 250
    }
];

app.get('/api/v1/restaurants/1/menues/categories/1/drinks', (req, res) => {
    res.send(itemBebidas);
});

app.get('/api/v1/restaurants/1/menues/categories/1/drinks/:id', (req,res) => {
    const item = itemBebidas.find(i => i.id === parseInt(req.params.id));
    if(!item) return res.status(404).send("La bebida no se encontró");
    res.send(item);
});

app.post('/api/v1/restaurants/1/menues/categories/1/drinks', (req, res) => {
    const {error} = validateItem(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const item = {
        id: itemBebidas.length + 1,
        nombre: req.body.nombre,
        precio: req.body.precio
    };
    itemBebidas.push(item);
    res.send(item);
});

app.put('/api/v1/restaurants/1/menues/categories/1/drinks/:id', (req, res) => {
    const item = itemBebidas.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(400).send("La bebida no se encontró");

    const {error}  = validateItem(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    item.nombre = req.body.nombre;
    item.precio = req.body.precio;

    res.send(item);
});

//FUNCIONA
app.delete('/api/v1/restaurants/1/menues/categories/1/drinks/:id', (req, res) => {
    const item = itemBebidas.find(i => i.id === parseInt(req.params.id));
    if(!item) return res.status(400).send('La bebida no se encontró');

    const index = itemBebidas.indexOf(item);
    itemBebidas.slice(index, 1);

    res.send(item);
});

function validateItem(item){
    const schema = {
        nombre: Joi.string().min(3).required(),
        precio: Joi.number().required()
    };

    return Joi.validate(item, schema);
}

app.listen(port, () => console.log(`Listening on port ${port}`));