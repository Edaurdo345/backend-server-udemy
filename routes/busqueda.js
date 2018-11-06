var express = require('express');
var app = express();
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');


//====================================
//Busqueda por colleccion
app.get('/colleccion/:tabla/:busqueda', (req, res, next) => {
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    //Expresion regular para buscar por palabras
    var regex = new RegExp(busqueda, 'i');
    var promesa;
    //Dependiendo de que tabla se busca se mandara mensaje en caso de que no sea la correcta
    switch (tabla) {
        case 'medico':
            promesa = buscarMedicos(busqueda, regex);
            break;
        case 'usuario':
            promesa = buscarUsuarios(busqueda, regex);
            break;
        case 'hospital':
            promesa = buscarHospitales(busqueda, regex);
            break;

        default:
            res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busquedas solo son : Usuarios,Medico y Hospitales',
                error: 'Tipo de tabla/Colección no válido'

            });
            break;
    }

    promesa.then((data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    }));



});
//====================================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    //Expresion regular para buscar por palabras
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda, regex)])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        });

});


function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, refect) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')//Segundo parametro los campos de la collection usuario que se mostraran
            .exec((err, hospitales) => {

                if (err) {
                    refect('Error al cargar Hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });
    });


}

function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, refect) => {
        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {
                if (err) {
                    refect('Error al cargar Medicos', err);
                } else {
                    resolve(medicos);
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, refect) => {
        Usuario.find({}, 'nombre email role') //Para evitar que nos muestre el usuario
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    refect('Error al cargar Usuarios', err);
                } else {
                    resolve(usuarios);
                }


            });
    });

}

module.exports = app;