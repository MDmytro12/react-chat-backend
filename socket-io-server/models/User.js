const {Schema , model} = require('mongoose')

const schema = Schema({
    name : { type : String , required : true } ,
    email : {type : String , unique : true , required : true} ,
    password : {  type : String , required : true},
    isOnline : { type : Boolean , required : true }
})

module.exports = model( 'user' , schema )