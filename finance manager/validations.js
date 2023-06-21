import { body } from "express-validator";

export const registerValidation = [
    body('email', 'Wrong Email!').isEmail(),
    body('password', 'Wrong password!(At least 3 symbols!)').isLength({ min: 3 }),
    body('fullName', 'Wrong name! (At least 3 symbols!)').isLength({ min: 3 }),
    body('avatarURL', 'Wrong URL!').optional().isURL(),
]

export const loginValidation = [
    body('email', 'Wrong Email!').isEmail(),
    body('password', 'Wrong password!(At least 3 symbols!)').isLength({ min: 3}),
]

export const postCreateValidation = [
    body('title', 'Напишіть заголовок').isLength({ min: 3 }).isString(),
    body('text', 'Напишіть текст статті').isLength({ min: 5 }).isString(),
    body('tags', 'Неправильний формат тегів (вкажіть масив)').optional().isString(),
    body('ImageURL', 'Wrong URL!').optional().isString(),
]

