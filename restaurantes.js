const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

const restaurants = [
    { 
        id: 1,
        nombre: "Burger King",
        calle: "Av Hipolito Yrigoyen",
        numero: 2500,
        barrio: "Banfield",
        localidad: "Lomas de Zamora",
        provincia: "Buenos Aires",
        pais: "Argentina",
        geoLatitud:"51° 30' 30'' N",
        geoLongitud: "0° 7' 32'' O",
        dias: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"],
        apertura: 14,
        cierre: 00,
        cerradoTemp: false,
        fotos:[],
        especialidad: "rapida",
        precioMin: 125,
        precioMax: 6000
    },

    { 
        id: 2,
        nombre: "Starbucks",
        calle: "Colombres",
        numero: 200,
        barrio: "Las Lomitas",
        localidad: "Lomas de Zamora",
        provincia: "Buenos Aires",
        pais: "Argentina",
        geoLatitud:"51° 30' 30'' N",
        geoLongitud: "0° 7' 32'' O",
        dias: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"],
        apertura: 14,
        cierre: 00,
        cerradoTemp: false,
        fotos:[],
        especialidad: "cafe",
        precioMin: 250,
        precioMax: 4000
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
        nombre: req.body.nombre,
        calle: req.body.calle,
        numero: req.body.numero,
        barrio: req.body.barrio,
        localidad: req.body.localidad,
        provincia: req.body.provincia,
        pais: req.body.pais,
        geoLatitud: req.body.geoLatitud,
        geoLongitud: req.body.geoLongitud,
        dias: req.body.dias,
        apertura: req.body.apertura,
        cierre: req.body.cierre,
        cerradoTemp: req.body.cerradoTemp,
        especialidad: req.body.tipoComida,
        precioMin: req.body.precioMin,
        precioMax: req.body.precioMax
    };
    restaurants.push(restaurant);
    res.send(restaurant);
});

app.put('/api/v1/restaurants/:id', (req, res) => {
    const restaurant = restaurants.find(r => r.id === parseInt(req.params.id));
    if(!restaurant) return res.status(400).send("El restaurante no se encontró");

    const {error} = validateRestaurant(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    restaurant.nombre = req.body.nombre;
    restaurant.calle = req.body.calle;
    restaurant.numero = req.body.numero;
    restaurant.barrio = req.body.barrio;
    restaurant.localidad = req.body.localidad;
    restaurant.provincia = req.body.provincia;
    restaurant.pais = req.body.pais;
    restaurant.geoLatitud = req.body.geoLatitud;
    restaurant.geoLongitud = req.body.geoLongitud;
    restaurant.dias = req.body.dias;
    restaurant.apertura = req.body.apertura;
    restaurant.cierre = req.body.cierre;
    restaurant.cerradoTemp = req.body.cerradoTemp;
    restaurant.especialidad = req.body.especialidad;
    restaurant.precioMin = req.body.precioMin;
    restaurant.precioMax = req.body.precioMax;

    res.send(restaurant);
});

//NO FUNCIONA
app.delete('api/v1/restaurants/:id', (req, res) => {
    const restaurant = restaurants.find(r => r.id === parseInt(req.params.id));
    if(!restaurant) return res.status(400).send('El restaurante no se encontró');

    const index = restaurants.indexOf(restaurant);
    restaurants.slice(index, 1);

    res.send(restaurant);
});

function validateRestaurant(restaurant){
    const schema = {
        nombre: Joi.string().min(1).required(),
        calle: Joi.string().min(3).required(),
        numero: Joi.number().integer().required(),
        barrio: Joi.string().min(3).required(),
        localidad: Joi.string().min(3).required(),
        provincia: Joi.string().min(3).required(),
        pais: Joi.string().min(3).required(),
        geoLatitud: Joi.string().min(2).required(),
        geoLongitud: Joi.string().min(2).required(),
        dias: Joi.array().items(Joi.string()).required(),
        apertura: Joi.number().integer().required(),
        cierre: Joi.number().integer().required(),
        cerradoTemp: Joi.boolean().required(),
        fotos: Joi.array().items(Joi.string()).required(),
        especialidad: Joi.string().min(3).required(),
        precioMin: Joi.number().integer().required(),
        precioMax: Joi.number().integer().required()
    };

    return Joi.validate(restaurant, schema);
}

app.listen(port, () => console.log(`Listening on port ${port}`));