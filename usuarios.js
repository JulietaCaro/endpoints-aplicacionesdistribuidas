const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

const users = [
    { 
        id: 1, 
        email: "juan@mail.com", 
        password: "1235", 
        name: "maria", 
        profilePic: "", 
        isOwner: true
    },
    
    { 
        id: 2, 
        email: "maria@mail.com.ar", 
        password: "hola", 
        "name": "", 
        profilePic: "foto.jpg", 
        isOwner: false
    }
];

app.get("/api/v1/users", (req, res) => {
    res.send(users);
});

app.get('/api/v1/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if(!user) return res.status(404).send('El usuario no se encontró');
    res.send(user);
});

app.post('/api/v1/users', (req, res) => {
    const { error } = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = {
        id: users.length + 1,
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        profilePic: req.body.profilePic,
        isOwner: req.body.isOwner
    };
    users.push(user);
    res.send(user); 
});

app.put('/api/v1/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if(!user) return res.status(400).send("El usuario no se encontró");

    const { error} = validateUserPut(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    user.password = req.body.password;
    user.name = req.body.name;
    user.profilePic = req.body.profilePic;
    user.isOwner = req.body.isOwner;

    res.send(user);
});


//NO FUNCIONA
app.delete('api/v1/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if(!user) return res.status(400).send("El usuario no se encontró");

    const index = users.indexOf(user);
    users.slice(index, 1);

    res.send(user);
});

function validateUser(user){
    const schema = {
        email: Joi.string().min(3).required().email(),
        //email: Joi.string().email().required(),
        password: Joi.string().min(4).required(),
        name: Joi.string().min(3).optional(),
        profilePic: Joi.string().optional(),
        isOwner: Joi.boolean().required()
    };

    return Joi.validate(user, schema);
};

function validateUserPut(user){
    const schema = {
        password: Joi.string().min(4).optional(),
        name: Joi.string().min(2).optional(),
        profilePic: Joi.string().optional()
    };

    return Joi.validate(user, schema);
};

app.listen(port, () => console.log(`Listening on port ${port}`));