var express=require('express');
var app=express();

// /Raiz
//Recibe tres parametros
//Request
//Response
//next: Caundo se ejecute seguira la siguiente opción 
app.get('/',(req,res,next)=>{
    //Mandamos el estatus de la peticion
   res.status(200).json({
        ok:true,
        mensaje:'Peticion realizada corretamente'
   
     });  
});

module.exports=app;
