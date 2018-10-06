//Requires
//Cargamos libreria de express

var express=require('express');
var mongoose=require('mongoose');
var bodyParser = require('body-parser')
//Importar Rutas
var appRoutes=require('./routes/app');
var usuarioRoutes=require('./routes/usuario');
var loginRoutes=require('./routes/login');


//inicializar variable express
var app=express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//Conexión Bd
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',(err,res)=>{
if(err) throw err;//Recorta el proceso y muestra error en consola
console.log("Base de datos online");
});

//Rutasapp
//Middleware
app.use('/usuario',usuarioRoutes); 
app.use('/login',loginRoutes); 
app.use('/',appRoutes);






//Escuchar peticiones
app.listen(3000,'10.0.0.20', ()=>{
console.log("express server puerto 3000 online ");
});
