const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

const restaurants = [
    { 
        id: 1,
        name: "Burger King",
        Direction: {
            street: "Av Hipolito Yrigoyen",
            streetNumber: 2500,
            neighbourhood: "Banfield",
            state: "Lomas de Zamora",
            province: "Buenos Aires",
            country: "Argentina",
        },
        latitude:"51° 30' 30'' N",
        longitude: "0° 7' 32'' O",
        days: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"],
        open: 14,
        close: 00,
        isClosed: false,
        photos:[],
        specialty: "rapida",
        range: "$$"
    },

    { 
        id: 2,
        name: "Starbucks",
        Direction: {
            street: "Colombres",
            streetNumber: 200,
            neighbourhood: "Las Lomitas",
            state: "Lomas de Zamora",
            province: "Buenos Aires",
            country: "Argentina",
        },
        latitude:"51° 30' 30'' N",
        longitude: "0° 7' 32'' O",
        days: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"],
        open: 14,
        close: 00,
        isClosed: false,
        photos:[],
        specialty: "cafe",
        range: "$$$"
    }
];

app.get('/api/v1/restaurants', (req, res) => {
    res.send(restaurants);
});

app.get('/api/v1/restaurants/:id', (req, res) => {
    const restaurant = restaurants.find(r => r.id === parseInt(req.params.id));
    if(!restaurant) return res.status(404).send('El restaurante no se encontró');
    res.send(restaurant);
});

app.post('/api/v1/restaurants', (req, res) => {
    const { error } = validateRestaurant(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const restaurant = {
        id: restaurants.length + 1,
        name: req.body.name,
        Direction: {
            street: req.body.Direction.street,
            streetNumber: req.body.Direction.streetNumber,
            neighbourhood: req.body.Direction.neighbourhood,
            state: req.body.Direction.state,
            province: req.body.Direction.province,
            country: req.body.Direction.country,
        },
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        days: req.body.days,
        open: req.body.open,
        close: req.body.close,
        isClosed: req.body.isClosed,
        specialty: req.body.tipoComida,
        minPrice: req.body.minPrice,
        maxPrice: req.body.maxPrice
    };
    restaurants.push(restaurant);
    res.send(restaurant);
});

app.put('/api/v1/restaurants/:id', (req, res) => {
    const restaurant = restaurants.find(r => r.id === parseInt(req.params.id));
    if(!restaurant) return res.status(400).send("El restaurante no se encontró");

    const {error} = validateRestaurant(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    restaurant.name = req.body.name;
    restaurant.Direction.street = req.body.street;
    restaurant.Direction.streetNumber = req.body.streetNumber;
    restaurant.Direction.neighbourhood = req.body.neighbourhood;
    restaurant.Direction.state = req.body.state;
    restaurant.Direction.province = req.body.province;
    restaurant.Direction.country = req.body.country;
    restaurant.latitude = req.body.latitude;
    restaurant.longitude = req.body.longitude;
    restaurant.days = req.body.days;
    restaurant.open = req.body.open;
    restaurant.close = req.body.close;
    restaurant.isClosed = req.body.isClosed;
    restaurant.specialty = req.body.specialty;
    restaurant.minPrice = req.body.minPrice;
    restaurant.maxPrice = req.body.maxPrice;

    res.send(restaurant);
});

app.delete('api/v1/restaurants/:id', (req, res) => {
    const restaurant = restaurants.find(r => r.id === parseInt(req.params.id));
    if(!restaurant) return res.status(400).send('El restaurante no se encontró');

    const index = restaurants.indexOf(restaurant);
    restaurants.slice(index, 1);

    res.send(restaurant);
});

function validateRestaurant(restaurant){
    const schema = {
        name: Joi.string().min(1).required(),
        Direction: Joi.object().pattern(/.*/, Joi.string(), Joi.number(), Joi.string(), Joi.string(), Joi.string(), Joi.string()),
        latitude: Joi.string().min(2).required(),
        longitude: Joi.string().min(2).required(),
        days: Joi.array().items(Joi.string()).required(),
        open: Joi.number().integer().required(),
        close: Joi.number().integer().required(),
        isClosed: Joi.boolean().required(),
        photos: Joi.array().items(Joi.string()).required(),
        specialty: Joi.string().min(3).required(),
        minPrice: Joi.number().integer().required(),
        maxPrice: Joi.number().integer().required()
    };

    return Joi.validate(restaurant, schema);
}

app.listen(port, () => console.log(`Listening on port ${port}`));