const { body , param} = require("express-validator")

exports.validateCreateExibitorBrands = [
    param('eventId')
        .isUUID().withMessage('Must provide a valid UUID'),

    body('name')
        .notEmpty().withMessage('Name is required')
        .isString().withMessage('Name must be a string'),
    body('contactPersonInfo')
        .isObject().withMessage('Contact information must be an object'),
    body('contactPersonInfo.name')
        .notEmpty().withMessage('name is required')
        .isString().withMessage('Contact name must be a string'),
    body('contactPersonInfo.email')
        .isEmail().withMessage('Must be a valid email'),
    body('contactPersonInfo.phone')
        .isMobilePhone('en-IN').withMessage('Must be a valid Indian phone number')
]

