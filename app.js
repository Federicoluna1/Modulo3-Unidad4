const e = require('express');
const express = require('express');
const mysql = require('mysql');
const util = require ('util')
const app = express();

app.use(express.json());

const puerto = 3000

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database: 'pintura'
});

conexion.connect((error)=>{
    if(error) {
        throw error;
    }
    
    console.log ('Conexión con base de datos mysql establecida');
    });;

const qy = util.promisify (conexion. query).bind(conexion);


app.get ('/categoria', async (req, res)=>{
    try{
        const query = 'SELECT * FROM categoria';
        
        const respuesta = await qy (query);

        res.send ({'respuesta': respuesta});
    }
    catch {
        console.error(e.message);
        res.status(413).send({"Error": e.message});
    }
});


app.listen (3000, ()=>{
    console.log ('Servidor  escuchando en el puerto 3000')
});
    