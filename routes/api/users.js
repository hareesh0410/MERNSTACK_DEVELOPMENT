const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator'); 
const User = require('../../models/User');

//@Route POST api/users
//@desc Register User
//@access public
router.post('/', [
    check('name', 'Name is required')
    .not()
    .isEmpty(),
    
    check('email', 'please include a valid email').isEmail(),
    check('password', 'please enter a pawssword with 6 or more characters').isLength({min: 6})
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try{
    //See if user exists
    let user  = await User.findOne({  email });
    if(user){
       return res.status(400).json({ errors:[{ msg:'User already exsists' }] });
    }
    //Get gravatar
    const avatar = gravatar.url(email, {
        s:'200',
        r:'pg',
        d:'mm'
    })

    user = new User({
        name,
        email,
        avatar,
        password
    });
    //Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password  = await bcrypt.hash(password, salt);
    await user.save();

    //Return jsonwebtoken
    
    const payload = {
        user:{
            id: user.id
        }
    };

    jwt.sign(payload, config.get("jwtsecret"), { expiresIn: 360000 }, (err, token) => {
        if(err) throw err
        res.json({ token });
    });

    
    }catch(err){

        console.log(err.message);
        res.status(500).send('server error');

    }


    console.log(req.body);


});

module.exports = router;