const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

const owners = [
    { id: 1, email: "juan@mail.com", password: "1235"},
    { id: 2, email: "maria@mail.com.ar", password: "hola"}
];

//prueba
/*app.get('/', (req, res) => {
    res.send("Hola mundo!");
});*/

app.get("/api/owners", (req, res) => {
    res.send(owners);
});

app.get('/api/owners/:id', (req, res) => {
    const owner = owners.find(o => o.id === parseInt(req.params.id));
    if(!owner) return res.status(404).send('El dueño no se encontró');
    res.send(owner);
});

app.post('/api/owners', (req, res) => {
    const { error } = validateOwner(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const owner = {
        id: owners.length + 1,
        email: req.body.email,
        password: req.body.password
    };
    owners.push(owner);
    res.send(owner); 
});

app.put('/api/owners/:id', (req, res) => {
    const owner = owners.find(o => o.id === parseInt(req.params.id));
    if(!owner) return res.status(400).send("El dueño no se encontró");

    const { error} = validateOwner(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    owner.email = req.body.email;
    owner.password = req.body.password;

    res.send(owner);

});

app.delete('api/owners/:id', (req, res) => {
    const owner = owners.find(o => o.id === parseInt(req.params.id));
    if(!owner) return res.status(400).send("El dueño no se encontró");

    const index = owners.indexOf(owner);
    owners.slice(index, 1);

    res.send(owner);
});

function validateOwner(owner){
    const schema = {
        email: Joi.string().min(3).required().email(),
        //email: Joi.string().email().required(),
        password: Joi.string().min(4).required(),
    };

    return Joi.validate(owner, schema);
}

app.listen(port, () => console.log(`Listening on port ${port}`));