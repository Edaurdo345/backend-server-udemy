var jwt = require('jsonwebtoken');
var SEED= require('../config/config').SEED;

// verificaTokens funcion que al importar este archivo se utliza para proteger rutas    
exports.verificaTokens=function(req,res,next){

 //Recibimos el token por query
var token=req.query.token;
//Verificamos si el tema es valido con jwt.verify  variable err contiene algo si genera error
//decoded contiene información del usuario
jwt.verify(token,SEED,(err,decoded)=>{

   //Si ocurre error  siempre entrara en esta parte
    if (err){
        //401 No Autorizado
        return res.status(401).json({
            ok:false,
            mensaje:'Token Incorrecto',
            errors:err
        });
    }

    //Mandamos datos en request
    req.usuario=decoded;

    /*return res.status(201).json({
        ok:true,
        decoded:decoded
        });*/
     //Next le dice que puede seguir con las demas funciones  puit,post que se encuentran abajo
       next();

});

    
    

}