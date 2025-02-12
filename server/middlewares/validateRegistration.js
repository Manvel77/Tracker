const { body, validationResult } = require('express-validator');

const validateRegistration = [
    body('email')
        .isEmail()
        .withMessage('Invalid email format'),

    body('username')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long')
        .matches(/^\w+$/)
        .withMessage('Username must contain only letters, numbers, and underscores'),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/\d/)
        .withMessage('Password must contain at least one number'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {validateRegistration};
