import jwt  from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.js';

export const register = async (req, res) => {
    try{
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
        email: req.body.email,
        fullName: req.body.fullName,
        avatarURL: req.body.avatarURL,
        passwordHash: hash,
        })

        const user = await doc.save();

        const token = jwt.sign(
            {
            _id: user._id
            },
            'secret',
            {
                expiresIn: '30d'
            }
        )

        const {passwordHash, ...userData} = user._doc;

        // localStorage.setItem('token', token);
        res.redirect(`/me/${user._id}`);
        
        
        // res.json({
        //     ... userData,
        //     token
        // });
    } catch(err){
        console.log(err);
        res.status(500).json({
            massage: "Can't register! :("
        })
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        
        if(!user){
            return req.status(404).json({
                message: 'User not found!'
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if(!isValidPass){
            return res.status(400).json({
                message: 'Incorrect login or password!'
            })
        }

        const token = jwt.sign(
            {
            _id: user._id
            },
            'secret',
            {
                expiresIn: '30d'
            }
        )

        const {passwordHash, ...userData} = user._doc;
        
        console.log(user._id);
        res.json({...userData, token});

        fetch('https://example.com/api/login')
            .then(response => response.json())
            .then(data => {
                const token = data.token;

                // Handle the token
                console.log(token);

                // Save the token in localStorage or perform further operations
                // ...
            })
            .catch(error => {
                // Handle any errors
                console.error(error);
            });

    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Can't login!"
        })
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        
        if(!user) {
            return res.status(404).json({
                message: 'Not found!'
            })
        }
        
        const {passwordHash, ...userData} = user._doc;
        
        res.json(userData);
        console.log(userData);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'No access!'
        })
    }
};





// async function authData(url){
    //     const f = await fetch(url, {
        //         method:'POST',
        //         headers:{
            //             Authorization:`Bearer ${token}`
            //         },
            //         redirect: '/'
            //     })
            //     return await f.json();
            // }
// authData('http://localhost:4000/auth/login');