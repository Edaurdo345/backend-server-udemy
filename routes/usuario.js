var express=require('express');
var app=express();
var Usuario= require('../models/usuario');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
//var SEED= require('../config/config').SEED;
var mdAutenticacion= require('../middlewares/autenticacion');
// /Raiz
//Recibe tres parametros
//Request
//Response
//next: Caundo se ejecute seguira la siguiente opción 
//Obtiene todos los usuarios
app.get('/',(req,res,next)=>{

    var desde=req.query.desde|| 0; //Si viene vacio pne 0
    desde=Number(desde);

    Usuario.find({},'nombre email img role')
    .skip(desde) //Salta los registros que se le mande (salta los registros)
    .limit(5)//Obtiene solo 5 registros
        .exec((err,usuarios)=>{

            if(err){
                    return res.status(500).json({
                    ok:false,
                    mensaje:'Error cargando usuario',
                    errors:err
                    });
            }

            Usuario.count({},(err,conteo)=>{
                return res.status(200).json({
                    ok:true,
                    usuarios:usuarios,
                    total:conteo
                    });
                });

            });
        
         
     
});




//Funcion para actualizar un nuevo usuario\
//:id esto hace que se obligatorio mandar un id por esta ruta
app.put('/:id',mdAutenticacion.verificaTokens,(req,res)=>{
//Parametros de la ruta
var id=req.params.id;
//Parametros del body cabecera
var body=req.body;

//Viene del model buscamos por id usuario es el objeto que se encuentra
Usuario.findById(id,(err,usuario)=>{

    
    if (err){
        return res.status(400).json({
            ok:false,
            mensaje:'error al crear Usuario',
            errors:err
        });
    }

    //Si no existe ususario buscado lanzara este estatus 
     if(!usuario){
        return res.status(400).json({
            ok:false,
            mensaje:'El usuario con el id '+id+' no existe',
            errors:{message:'No existe un usuario con ese id'}
            });
      }  
 

      //Aqui seteamos los datos a la variable usuario que vienen del cuerpo body
      usuario.nombre=body.nombre;
      usuario.email=body.email;
      usuario.role=body.role;

      //Guardamos el objetos en realidad se hace un update y regresamos 
      usuario.save((err,usuarioGuardado)=>{

        //Si ocurre error
        if (err){
            return res.status(400).json({
                ok:false,
                mensaje:'error al actualizar usuario',
                errors:err
            });
        }
        
        return res.status(200).json({
            ok: true,
            usuario: usuarioGuardado
            });

      });
});




});


//Funcion para crear un nuevo usuario
app.post('/',mdAutenticacion.verificaTokens,(req,res)=>{

    var body=req.body;
    var usuario=new Usuario({
        nombre: body.nombre,
        email:body.email,
        password:bcrypt.hashSync(body.password,10),
        img:body.img,
        role:body.role
    });

    usuario.save((err,usuarioGuardado)=>{

        if (err){
            return res.status(400).json({

                ok:false,
                mensaje:'error al crear Usuario',
                errors:err
            })

        }
      
        return res.status(201).json({
            ok:true,
            body:body
            });
        
    });

});


//Borrar usaurio por el id
app.delete('/:id',mdAutenticacion.verificaTokens,(req,res)=>{

    var id=req.params.id;
    Usuario.findByIdAndRemove(id,(err,usuarioBorrado)=>{

        if (err){
            return res.status(400).json({
                ok:false,
                mensaje:'Error al borrar usuario',
                errors:err
            });
        }
        if(!usuarioBorrado){
            return res.status(400).json({
                ok:false,
                mensaje:'No existe usuario con ese id',
                errors:{message:'No existe usuario con ese id'}
            });

        }

        return res.status(200).json({
            ok:true,
            usuario:usuarioBorrado
            });
        
        
    });





});

module.exports=app;