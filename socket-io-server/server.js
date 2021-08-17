const express = require('express')
const http = require('http')
const cors = require('cors')
const socketIO = require('socket.io')
const mongoose = require('mongoose')
const Message = require('./models/Message')

const app = express()
const server = http.createServer(app)

const PORT = process.env.PORT || 4000

app.use(cors())
app.use( express.json() )
app.use( express.urlencoded( { extended : true } ) )

app.use('/auth' , require('./routes/auth.routes.js'))
app.use('/acc' , require('./routes/account.routes.js'))

const io = socketIO( server , {
    cors : { 
        origin : "*" , 
        methods : [ "GET" , "POST" ]
    }
} )

async function start(){
    try{
        await mongoose.connect('mongodb+srv://dimasta:zasada12@cluster0.qjkx2.mongodb.net/app?retryWrites=true&w=majority' , {
            useNewUrlParser: true ,
            useCreateIndex:true ,
            useUnifiedTopology:true
        })

        server.listen( PORT , () => {
            console.log(`Server started on port : ${PORT}`)
        })

    }catch(e){ 
        console.log('Server ERROR : ' , e)
        process.exit(1)
    }
}

io.on( 'connection' , (socket) => {

    socket.on( 'dialog_message'  , async (message) => {
        const newMessage = new Message(message)

        await newMessage.save()
        
        const allMessages = await Message.find({dialogId : message.dialogId})

        io.sockets.emit('dialog_message' , allMessages  )
    } )

} )
  
start()
