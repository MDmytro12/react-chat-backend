const {Schema , model} = require('mongoose')

const schema = Schema({
    content : String ,
    dialogId : String,
    sended_at : { type : Date , default : Date.now } ,
    authors : String ,
    isReadedBy : [String]
})

module.exports = model('message' , schema)