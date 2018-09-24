//Requires
//Cargamos libreria de express

var express=require('express');
var mongoose=require('mongoose');

//inicializar variable express
var app=express();

//Conexión Bd
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',(err,res)=>{
if(err) throw err;//Recorta el proceso y muestra error en consola

console.log("Base de datos online");

});

//Rutas
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

//Escuchar peticiones
app.listen(3000, ()=>{

console.log("express server puerto 3000 online ");
});
