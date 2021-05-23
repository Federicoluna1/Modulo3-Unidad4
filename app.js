const express = require('express');
const mysql = require('mysql');
const util = require ('util')
const app = express();


app.use(express.json());

const puerto = 3000

//conexion con Base de datos
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database: 'suscriptores'
});

const qy = util.promisify (conexion. query.bind(conexion));

conexion.connect((error)=>{
    if(error) {
        throw error;
    }
    
    console.log ('Conexión con base de datos mysql establecida');
    });;


//Variables para funciones y validaciones
let nombre = req.body.nombre.toUpperCase();
let apellido = req.body.apellido.toUpperCase();
let dni = req.body.dni.toUpperCase();
let email = req.body.email.toUpperCase();

//GET
app.get ('/misDatos', async (req, res)=>{
    try {
        const query = 'SELECT * FROM suscriptores';
        
        const respuesta = await qy (query);

        res.send ({'respuesta': respuesta});

        if (respuesta.lenght == 0) {
            throw new Error ('No hay suscriptor con esos datos');
    }
    }
    catch {
        console.error(e.message);
        res.status(413).send({"Error": e.message});
    }
});

//POST
app.post('/suscripcion', async (req, res ) =>{
    try {
       
        function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

        if (!nombre || !apellido || !dni || !email){
        res.status(413).send('Faltan datos');
    }

        if (validateEmail(email) == false){
        res.status(413).send('Email invalido');
    }

        let query = 'SELECT id FROM suscriptores WHERE email = ?'
        let respuesta = await qy(query, [email]);

        if (respuesta.length > 0) {
            throw new Error ('Ese email ya esta registrado');
    }
    
        const {nombre, apellido, dni, email} = req.body;
        conexion.query("INSERT INTO `suscriptores`(`nombre`, `apellido`, `dni`, `email`)" +
        "VALUES ('"+nombre+"','"+apellido+"','"+dni+"','"+email+"')");
        var html ="<html><head><title>SeHaSuscripto</title></head><body><h1>Se ha suscripto correctamente a nuestro Newsletter</h1>" +
        "<a href='/'>Volver al Blog</a></body></html>";
        res.send(html);
    }

    catch {
        console.error(e.message);
        res.status(413).send({"Error": e.message});
    }
});


app.listen (3000, ()=>{
    console.log ('Servidor  escuchando en el puerto 3000')
});
    