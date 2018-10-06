var express=require('express');
var app=express();
var Usuario= require('../models/usuario');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED= require('../config/config').SEED;

app.post('/',(req,res)=>{
 

    //Aqui recibimos el email y password
    var body=req.body;
    //Regresa un unico registro filtrando con el campo qeu se mande
    Usuario.findOne({email: body.email}, (err,usuarioBD)=>{

        if (err){
            return res.status(500).json({

                ok:false,
                mensaje:'Error al buscar Usuarios',
                errors:err
            });

        }
        //Validamos si existe usuario con correo 
        if(!usuarioBD){
            return res.status(400).json({

                ok:false,
                mensaje:'Credenciales Incorrectas -email',
                errors:err
            });
        }

        //Hasta aqui usuario ingreso email correcto
        //Aqui validamos el password con bcrypt
        //compareSync permite comparar string sin hash y compara el hash en este caso el que esta almacenado en la bd
        if(!bcrypt.compareSync(body.password,usuarioBD.password)){
            //Si falla entra al if
            return res.status(400).json({

                ok:false,
                mensaje:'Credenciales Incorrectas -password',
                errors:err
            });
        }

        //para no mandar contraseña en token mandamos carita feliz
        usuarioBD.password=':)';


        //Crear un token!!
        //payload
       var token=jwt.sign({
         usuario:usuarioBD //Datos de bd
       },
       SEED,//Clave secret
       {expiresIn:14400} //4 horas fecha de expiración 
         )

        return res.status(200).json({
            ok:true,
            usuario:usuarioBD,
            token:token,
            id:usuarioBD.id
            });


    });

  


});


 module.exports=app;