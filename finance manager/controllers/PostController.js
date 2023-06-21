import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts);
    } catch(err){
        console.log(err);
        res.status(500).json({
            message: "Статтю неможливо знайти статті"
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        
        PostModel.findOneAndUpdate(
            { _id: postId }, { $inc: { viewsCount: 1 } }, { returnDocument: "After" })
            .then(doc => res.json(doc))
            .catch(err => res.status(500).json({
                message: "Стаття не знайдена" 
            })
        
        )

    } catch(err){
        console.log(err);
        res.status(500).json({
            message: "Статтю неможливо знайти"
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        
        PostModel.findOneAndDelete({ _id: postId })
        .then(doc => res.json({success: true}))
        .catch(err => res.status(500).json({
            message: "Стаття не знайдена"
        }))

    } catch(err){
        console.log(err);
        res.status(500).json({
            message: "Статтю неможливо знайти"
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageURL: req.body.imageURL,
            tags: req.body.tags,
            user: req.userId,
        })

        const post = await doc.save();
        
        res.json(post)
    } catch(err){
        console.log(err);
        res.status(500).json({
            message: "Статтю неможливо створити"
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne({ _id: postId }, {
            title: req.body.title,
            text: req.body.text,
            imageURL: req.body.imageURL,
            tags: req.body.tags,
            user: req.userId,
        })
        res.json({success: true});

    } catch(err){
        console.log(err);
        res.status(500).json({
            message: "Статтю неможливо оновити"
        })
    }
    
}