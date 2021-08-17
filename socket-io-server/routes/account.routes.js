const {Router} = require('express')
const router = Router()
const Dialog = require('../models/Dialog')
const Message = require('../models/Message')
const User = require('../models/User')

router.post('/getd' , async (req , res) => {
    const {email} = req.body

    const dialogs = await Dialog.find({ authors : email }) || []

    res.status(200).json(dialogs)
})

router.post('/getun' , async(req , res) => {
    const {email} = req.body 

    const user = await User.find({email})

    if(user.length === 0){
        return res.status(200).json([])
    }else{
        return res.status(200).json({ name : user[0].name , online : user[0].isOnline})
    }
    
})

router.post('/getmbdi' , async (req , res) => {
    const {dialogId} = req.body

    const messages = await Message.find({dialogId})

    res.status(200).json(messages) 
})

router.post('/exit' , async (req , res) => {
    const {email} = req.body

    await User.updateOne({email},  {$set : { isOnline : false }})

    return res.status(200).send('Exit!')
}) 

router.post('/delete' , async(req , res) => {
    await Message.remove({})
    return res.status(200).json({message : "Delete all messagies!"})
})

module.exports = router 