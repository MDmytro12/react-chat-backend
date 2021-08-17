const {Router} = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const Dialog = require('../models/Dialog')
const {check , validationResult} = require('express-validator')

const router = Router()

router.post('/log' , 
    [
        check('email' , 'Uncorect email!').isEmail() ,
        check('password' , 'Uncorrect password!').isLength({min:6})
    ]
    ,async (req , res) => {

        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json('Uncorrect data to login!')
        }

        const {email , password} = req.body

        const candidate = await User.findOne({email})

        if(!candidate){
            return res.status(400).json({message : "User dont exists!"})
        }

        const match = await bcrypt.compare(password , candidate.password)

        if(!match){
            return res.status(400).json({message : "Uncorrect password!"})
        }

        await User.updateOne({email} , {$set : {isOnline : true}})

        return res.status(200).json({email : candidate.email , name : candidate.name})

    }
)

router.post('/reg' ,
    [
        check('email' , 'Uncorrect email!').isEmail().normalizeEmail() ,
        check('password' , 'Uncorrect password!').isLength({min : 6}).exists() ,
        check('name' , "Enter your name!").isLength({min:1})
    ],
    async (req , res) => {
        const errors = validationResult(req)
    
        if(!errors.isEmpty()){
            return res.status(400).json({message : 'Yuor data is uncorrect to register!' , errors })
        }

        const {email , name , password} = req.body

        const candidate = await User.find({email})
  
        if(candidate.length){
            return res.status(400).json({message : "User with the same email exists!"})
        }

        const newUser = new User({
            email , 
            password : await bcrypt.hash(password , 12)
            , name ,
            isOnline : false
        })
        
        await newUser.save()

        const allUsers = await User.find()

        allUsers.map( async(user) => {
            if(user.email !== email ){
                let dialog = {
                    dialogId : await bcrypt.hash(user.email , 12 ) ,
                    authors : [email , user.email] ,
                    message : {
                        content: "Hello friend!Let`s start dialogue!" ,
                        sended_at: Date.now() ,
                        isReadedBy : []
                    }
                }

                dialog = new Dialog(dialog)
                await dialog.save()
            }
        } )
        
        return res.status(200).json({message : 'success'})
    }            
)

module.exports = router