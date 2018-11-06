var express = require('express');
var app = express();
var Usuario = require('../models/usuario')
var Medico = require('../models/medico')
var Hospital = require('../models/hospital')
var fs = require('fs');


app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;
    //Tipos de colecciones
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no valida',
            error: { mensaje: 'Los tipos de colecciones validas son ' + tiposValidos.join(", ") }

        });
    }


    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    //let sampleFile = req.files.sampleFile;
    //console.log(sampleFile);
    //files revisamos si contiene archivos caso contrario respondemos con un 400 mensaje de error
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            error: { mensaje: 'Debe de seleccionar una imagen' }
        });
    }
    //Obtener nombre del archivo (name)
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split(".");
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            error: { mensaje: 'Las extensiones validas son ' + extensionesValidas.join(", ") }

        });
    }
    //Si  pasas la regla extension seria valida
    //Nombre archivo personalizado se manda el id de la colleccion y se concatena con los millisegundos del objeto date y la extension del archivo que se desea subir
    //122254-123.png
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //Mover archivo
    //Creamos la carpeta path donde se guardara el archivo
    var path = `./uploads/${tipo}/${nombreArchivo}`;
    archivo.mv(path, err => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                error: err
            });
        }
        subirPorTipo(tipo, id, nombreArchivo, res);
        // return res.status(200).json({
        //     ok: true,
        //     mensaje: "Peticion realiazada correctamente",
        //     extensionArchivo: extensionArchivo
        // });
    });


});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    //Dependiendo del tipo de colleccion es lo que se guardara
    if (tipo == 'usuarios') {

        Usuario.findById(id, (err, usuario) => {
            //Path viejo es decir el guardado anteriormente
            //Validamos si existe el usuario con el id que se esta buscando
            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario no existe',
                    error: { message: 'Usuario no existe' }
                });
            }


            var pathViejo = './uploads/usuarios/' + usuario.img;
            console.log("img", pathViejo);
            //Revisamos si existe y si existe elimina el archivo anterior
            if (usuario.img.length > 0 && fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, function (err) {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'Error al eliminar archivo',
                            error: err
                        });
                    }
                    console.log('File deleted!');
                });
            }

            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';
                return res.status(200).json({
                    ok: true,
                    mensaje: "Imagen de usuario actualizada",
                    usuario: usuarioActualizado
                });


            });

        });
    }
    if (tipo == 'medicos') {
        Medico.findById(id, (err, medico) => {
            //Path viejo es decir el guardado anteriormente
            //Validamos si existe el medico con el id que se esta buscando
            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Medico no existe',
                    error: { message: 'Medico no existe' }
                });
            }


            var pathViejo = './uploads/medicos/' + medico.img;
            console.log("img", pathViejo);
            //Revisamos si existe y si existe elimina el archivo anterior
            if (medico.img.length > 0 && fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, function (err) {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'Error al eliminar archivo',
                            error: err
                        });
                    }
                    console.log('File deleted!');
                });
            }

            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {


                return res.status(200).json({
                    ok: true,
                    mensaje: "Imagen de medico actualizada",
                    medico: medicoActualizado
                });


            });

        });

    }
    if (tipo == 'hospitales') {
        Hospital.findById(id, (err, hospital) => {
            //Path viejo es decir el guardado anteriormente
            //Validamos si existe el hospital con el id que se esta buscando
            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Hospital no existe',
                    error: { message: 'Hospital no existe' }
                });
            }

            var pathViejo = './uploads/hospitales/' + hospital.img;
            console.log("img", pathViejo);
            //Revisamos si existe y si existe elimina el archivo anterior
            if (hospital.img.length > 0 && fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, function (err) {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'Error al eliminar archivo',
                            error: err
                        });
                    }
                    console.log('File deleted!');
                });
            }

            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {


                return res.status(200).json({
                    ok: true,
                    mensaje: "Imagen de hospital actualizada",
                    medico: hospitalActualizado
                });


            });

        });

    }

}

module.exports = app;
