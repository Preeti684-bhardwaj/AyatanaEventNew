const { body , query , param} = require("express-validator")

exports.validateCreateEvent = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isString().withMessage('Name must be a string'),
    body('eventType')
        .notEmpty().withMessage('Event type is required')
        .isIn(['free', 'paid']).withMessage('Event type must be eigther free or paid'),
    body('description')
        .notEmpty().withMessage('description is required')
        .isString().withMessage('Description must be a string'),
    body('industry')
        .notEmpty().withMessage('Industry is required')
        .isString().withMessage('Industry must be a string'),
    body('eventDate')
        .notEmpty().withMessage('Event date is required')
        .isISO8601().toDate().withMessage('Invalid date format'),
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

exports.validateGetAllEvent = [
    query('page').optional().isInt({ gt: 0 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ gt: 0 }).withMessage('Size must be a positive integer')
]

exports.validategetEventById = [
    param('id').isUUID().withMessage('Must provide a valid UUID'),
]