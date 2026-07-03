const http = require('http');
const fs = require('fs');
const express = require('express');
const mysql = require('mysql2');
const { error } = require('console');



const server = express();

server.use(express.urlencoded({ extended: true }));

server.use(express.static('public')); // sirve HTML, imágenes, CSS, todo

const conexion = mysql.createConnection({
    host:'10.1.15.29',
    user:'alumno',
    password:'alumno',
    database:'Javier'
});

const  cabecera =fs.readFileSync("public/header.html","utf8");
const  final=fs.readFileSync("public/footer.html","utf8");


server.post("/lol",(req,res)=>{
    const correo=req.body.correo;
    const clave=req.body.clave

    if((correo=="c@campeones.com") &&(clave=="1234")){
        const contenido=`
             <br>
             <img src="images/lol2.jpg">
             <br>
             <a href="/campeones"><h1>PROCEDA A LA GRIETA</h1></a>

        `;
        res.send(cabecera+contenido+final);
    }else{
        const contenido=`
        <br>
        <br>
        <img src="images/lol3.gif">
        <br>
        <h1>CARECES DE JG</h1>
        <br>
        <a href="/"><h1>Volver</h1></a>
        `;
        res.send(cabecera+contenido+final);
    }

});



server.listen(3000, () => {
    console.log('Servidor iniciado en puerto 3000 (OK) ');
});