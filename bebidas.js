const Joi = require('joi');
const express = require('express');
const func = require('joi/lib/types/func');
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

const itemBebidas = [
    {
        id: 1,
        name: "Cerveza Quilmes",
        price: 560
    },

    {
        id: 2,
        name: "Coca Cola 500ml",
        price: 250
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
        name: req.body.name,
        price: req.body.price
    };
    itemBebidas.push(item);
    res.send(item);
});

app.put('/api/v1/restaurants/1/menues/categories/1/drinks/:id', (req, res) => {
    const item = itemBebidas.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(400).send("La bebida no se encontró");

    const {error}  = validateItem(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    item.name = req.body.name;
    item.price = req.body.price;

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
        name: Joi.string().min(3).required(),
        price: Joi.number().required()
    };

    return Joi.validate(item, schema);
}

app.listen(port, () => console.log(`Listening on port ${port}`));