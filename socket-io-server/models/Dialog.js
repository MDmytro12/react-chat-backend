const {Schema , model} = require('mongoose')

const schema = Schema({
    dialogId : String,
    authors : [ String ] ,
    message : {
        content : String ,
        sended_at : { type : Date , default : Date.now } ,
        isReadedBy : [String]
    }
})

module.exports = model('dialog' , schema)  