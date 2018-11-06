var express=require('express');
var app=express();
var Hospital= require('../models/hospital');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
//var SEED= require('../config/config').SEED;
var mdAutenticacion= require('../middlewares/autenticacion');


app.get('/',(req,res,next)=>{
    var desde=req.query.desde|| 0; //Si viene vacio pne 0
    desde=Number(desde);
    Hospital.find({})
    .skip(desde) //Salta los registros que se le mande (salta los registros)
    .limit(5)//Obtiene solo 5 registros
        .populate('usuario','nombre email')
        .exec((err,hospitales)=>{

            if(err){
                    return res.status(500).json({
                    ok:false,
                    mensaje:'Error cargando hospitales',
                    errors:err
                    });
            }

            Hospital.count({},(err,conteo)=>{
                return res.status(200).json({
                    ok:true,
                    medicos:hospitales,
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
    Hospital.findById(id,(err,hospital)=>{
    
        
        if (err){
            return res.status(400).json({
                ok:false,
                mensaje:'error al crear Usuario',
                errors:err
            });
        }
    
        //Si no existe hospital buscado lanzara este estatus 
         if(!hospital){
            return res.status(400).json({
                ok:false,
                mensaje:'El hsopital con el id '+id+' no existe',
                errors:{message:'No existe un hospital con ese id'}
                });
          }  
     
    
          //Aqui seteamos los datos a la variable usuario que vienen del cuerpo body
          hospital.nombre=body.nombre;
          hospital.usuario=req.usuario._id;
          hospital.img=body.img;
    
          //Guardamos el objetos en realidad se hace un update y regresamos 
          hospital.save((err,hospitalGuardado)=>{
    
            //Si ocurre error
            if (err){
                return res.status(400).json({
                    ok:false,
                    mensaje:'error al actualizar hospital',
                    errors:err
                });
            }
            
            return res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
                });
    
          });
    });
    
    
    
    
    });

//Funcion para crear un nuevo usuario
app.post('/',mdAutenticacion.verificaTokens,(req,res)=>{

    var body=req.body;
    var hospital=new Hospital({
        nombre: body.nombre,
        usuario:req.usuario.usuario._id, //Se usa para tener al usaurio que lo creo
        img:body.img
    });

    hospital.save((err,hospitalGuardado)=>{

        if (err){
            return res.status(400).json({

                ok:false,
                mensaje:'error al crear Hospital',
                errors:err
            })

        }
      
        return res.status(201).json({
            ok:true,
            hospital:hospitalGuardado
            });
        
    });

}); 


//Borrar usaurio por el id
app.delete('/:id',mdAutenticacion.verificaTokens,(req,res)=>{

    var id=req.params.id;
    Hospital.findByIdAndRemove(id,(err,hospitalBorrado)=>{

        if (err){
            return res.status(400).json({
                ok:false,
                mensaje:'Error al borrar hospital',
                errors:err
            });
        }
        if(!hospitalBorrado){
            return res.status(400).json({
                ok:false,
                mensaje:'No existe hospital con ese id',
                errors:{message:'No existe hospital con ese id'}
            });

        }

        return res.status(200).json({
            ok:true,
            hospital:hospitalBorrado
            });
        
        
    });





});

module.exports=app;