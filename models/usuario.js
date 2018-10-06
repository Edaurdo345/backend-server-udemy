var mongoose= require('mongoose');
var uniqueValidator= require('mongoose-unique-validator');

//Funcion que permite definir esquemas
var Schema=mongoose.Schema;

//Valida roles permitidos listado
var rolesValidos={
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

//RECIBE UN OBJETO JAVASCRIPT
//Recibe los paraemtros que tenemos en el docuemnto menos el id
var usuarioSchema=new Schema({
 nombre :{ type:String,required:[true, 'El nombre es necesario'] }, //Caundo falle mostrara ese mensaje
 email :{ type:String,unique:true, required:[true, 'El correo es necesario'] }, //Campo unico (unique) y 
 password :{ type:String, required:[true, 'La contraseña es necesaria'] }, 
 img :{ type:String,required:false}, 
 role :{ type:String,required:true,default: 'USER_ROLE',enum:rolesValidos}, 
});

//Esto hara que el mensaje de error cuando un  campo no es unico se vea mas bonito
usuarioSchema.plugin(uniqueValidator,{message:'{PATH} debe de ser unico'});

module.exports=mongoose.model('Usuario',usuarioSchema);