var express = require('express');
var app = express();

const path = require('path');
const fs = require('fs');

// /Raiz
//Recibe tres parametros
//Request
//Response
//next: Caundo se ejecute seguira la siguiente opción 
app.get('/:tipo/:img', (req, res, next) => {
    //Mandamos el estatus de la peticion
    var tipo = req.params.tipo;
    var img = req.params.img;

    //Utilizaremos el paquete path el cual nos evitara escribir toda la ruta desde la raiz
    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    //Verificamos si existe el archivo
    if (fs.existsSync(pathImagen)) {
        //Si existe el archivo muestra imagen del archivo
        //sendFile con mayuscula la otra esta deprecada
        res.sendFile(pathImagen);
    } else {
        //Si no existe muestra la imagen que tenemos en assets/no-img.jpg
        var pathNoImagen = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImagen);

    }



    
});

module.exports = app;
