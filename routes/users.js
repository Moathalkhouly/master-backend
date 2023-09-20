const { User } = require('../models/user')
const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');



router.get(`/`, async (req, res) => {
    const users = await User.find({}).select('-passwordHash');
    if (!users) {
        res.status(404).send(`No user Found`)
    }
    res.status(200).json(users);
})


router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');

    if (!user) {
        res.status(500).json({ message: "the user with the given Id is not found." })
    }
    res.status(200).send(user)
})



router.post('/', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        street: req.body.street,
        apartment: req.body.apartment,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        isAdmin: req.body.isAdmin,
    })
    user = await user.save();

    if (!user)
        return res.status(404).send('user could not be created')
    res.status(200).send(user);
})



router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    const secret = process.env.secret

    if (!user) {
        return res.status(400).send('The user not found')
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin:user.isAdmin
            },
            secret,
            { expiresIn: '1d' }

        )
        res.status(200).send({ user: user.email, token: token })
    } else {
        res.status(400).send('password is wrong')
    }
})



router.post('/register',async (req,res)=>{
    let user = new User ({
        name: req.body.name,
        email: req.body.email,
        passwordHash:bcrypt.hashSync(req.body.password,10),
        phone: req.body.phone,
        street: req.body.street,
        apartment: req.body.apartment,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        isAdmin: req.body.isAdmin,
    })
    user = await user.save();

    if(!user)
    return res.status(404).send('user could not be created')
    res.status(200).send(user);
})

//how many users do i have
router.get('/get/count', async (req, res) => {
    const userCount = await User.countDocuments()
    if (!userCount) {
        res.status(500).json({ success: false })
    }
    res.send({
        userCount :userCount
    })
})

router.delete('/:id',(req,res)=>{
    User.findByIdAndRemove(req.params.id)
    .then(user=>{
        if(user){
            return res.status(200).json({sucess:true , message :"the user is deleted"})
        }
        else{
            return res.status(400).json({sucess:false , message :"user not found"})
        }
    })
    .catch(err=>{
        return res.status(400).json({success:false, error:err})
    })
})


module.exports = router