var express=require('express');
var app=express();
var Medico= require('../models/medico');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
//var SEED= require('../config/config').SEED;
var mdAutenticacion= require('../middlewares/autenticacion');


app.get('/',(req,res,next)=>{
    var desde=req.query.desde|| 0; //Si viene vacio pne 0
    desde=Number(desde);
    Medico.find({},'nombre img usuario hospital')
    .skip(desde) //Salta los registros que se le mande (salta los registros)
    .limit(5)//Obtiene solo 5 registros
        .populate('usuario','nombre email')
        .populate('hospital')
        .exec((err,medicos)=>{

            if(err){
                    return res.status(500).json({
                    ok:false,
                    mensaje:'Error cargando medico',
                    errors:err
                    });
            }

            Medico.count({},(err,conteo)=>{
                return res.status(200).json({
                    ok:true,
                    medicos:medicos,
                    total:conteo
                    });
                });
            });
        
     
});

//Funcion para actualizar un nuevo hospital\
//:id esto hace que se obligatorio mandar un id por esta ruta
app.put('/:id',mdAutenticacion.verificaTokens,(req,res)=>{
    //Parametros de la ruta
    var id=req.params.id;
    //Parametros del body cabecera
    var body=req.body;
    
    //Viene del model buscamos por id usuario es el objeto que se encuentra
    Medico.findById(id,(err,medico)=>{
    
        
        if (err){
            return res.status(400).json({
                ok:false,
                mensaje:'error al crear Medico',
                errors:err
            });
        }
    
        //Si no existe hospital buscado lanzara este estatus 
         if(!medico){
            return res.status(400).json({
                ok:false,
                mensaje:'El medico con el id '+id+' no existe',
                errors:{message:'No existe un medico con ese id'}
                });
          }  
     
    
          //Aqui seteamos los datos a la variable usuario que vienen del cuerpo body
          medico.nombre=body.nombre;
          medico.hospital=body.hospital;
          medico.usuario=req.usuario._id;
          medico.img=body.img;
    
          //Guardamos el objetos en realidad se hace un update y regresamos 
          medico.save((err,medicoGuardado)=>{
    
            //Si ocurre error
            if (err){
                return res.status(400).json({
                    ok:false,
                    mensaje:'error al actualizar Medico',
                    errors:err
                });
            }
            
            return res.status(200).json({
                ok: true,
                medico: medicoGuardado
                });
    
          });
    });
    
    
    
    
    });

//Funcion para crear un nuevo usuario
app.post('/',mdAutenticacion.verificaTokens,(req,res)=>{

    var body=req.body;
    var medico=new Medico({
        nombre: body.nombre,
        hospital: body.hospital,
        usuario:req.usuario.usuario._id, //Se usa para tener al usaurio que lo creo
        img:body.img
    });

    medico.save((err,medicoGuardado)=>{

        if (err){
            return res.status(400).json({

                ok:false,
                mensaje:'error al crear Medico',
                errors:err
            })

        }
      
        return res.status(201).json({
            ok:true,
            body:medicoGuardado
            });
        
    });

}); 


//Borrar medico por el id
app.delete('/:id',mdAutenticacion.verificaTokens,(req,res)=>{

    var id=req.params.id;
    Medico.findByIdAndRemove(id,(err,medicoBorrado)=>{

        if (err){
            return res.status(400).json({
                ok:false,
                mensaje:'Error al borrar medico',
                errors:err
            });
        }
        if(!medicoBorrado){
            return res.status(400).json({
                ok:false,
                mensaje:'No existe medico con ese id',
                errors:{message:'No existe medico con ese id'}
            });

        }

        return res.status(200).json({
            ok:true,
            medico:medicoBorrado
            });
        
        
    });





});

module.exports=app;