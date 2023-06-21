import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
// import bodyParser from 'body-parser';
import { registerValidation, loginValidation, postCreateValidation } from './validations.js';

import { UserController, PostController} from './controllers/index.js'; 

import {checkAuth, handleValidationErrors} from './utils/index.js';

const PORT = 4000;

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

mongoose.connect(
    'mongodb+srv://s3rkin:12344@finances.uy0vlmd.mongodb.net/blog?retryWrites=true&w=majority',
).then(() => console.log('db ok!'))
.catch((err) => console.log('error!'))

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({extended: false}));
// app.use(bodyParser.urlencoded({extended: false}));


app.set('view engine', 'ejs');
app.use(express.static('public'));

//........................................
app.get('/', (req, res) => {
    res.render('index', {email: req.body.email});
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/register', (req, res) => {
    res.render('register');
})

//........................................

import UserModel from './models/User.js';
import { render } from 'ejs';
import User from './models/User.js';


//...Authorization....................................................
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me/:id', checkAuth, UserController.getMe, (req, res) => {
    res.render('me');
});

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.listen(PORT, () => {
    console.log(`Server started: http://localhost:${PORT}`);
})

