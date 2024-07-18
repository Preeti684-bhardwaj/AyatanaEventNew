const BaseController = require('./base');
const models = require('../models');
const { Op } = require('sequelize');
const upload = require("../middleware/multer.middleware.js")
const moment = require("moment")
const path = require("path") 
const fs = require("fs");
const{ validationResult} = require("express-validator")
const { validateCreateEvent , validateGetAllEvent , validategetEventById } = require('../validations/event.validation.js');

class EventController extends BaseController {
	constructor() {
		super(models.Event);
        // Custom routes
        this.router.post('/create', upload.array("media") , validateCreateEvent  , this.createEvent.bind(this));
        this.router.get('/fetch/all' , validateGetAllEvent, this.getAllEvents.bind(this));
        this.router.get('/fetch/:id' , validategetEventById, this.eventById.bind(this));
	}
	listArgVerify(req,res,queryOptions)
	{
	}

   // Custom methods
   async createEvent(req, res) {
    try {

        // Handle validation results
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array({ onlyFirstError: true }) });
        }

        const { name, eventType, description, industry, eventDate , contactPersonInfo } = req.body;

        console.log(req.body)

        // Handle file uploads
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({ success: false , error: 'media file is required' });
        }

        // Ensure all uploaded files are valid
        for (const file of files) {
            const extname = /\.(jpeg|jpg|png|gif)$/i.test(path.extname(file.originalname));
            const mimetype = /^image\/(jpeg|jpg|png|gif)$/i.test(file.mimetype);
            if (!extname || !mimetype) {
                return res.status(400).json({ success: false , error: 'Only JPEG, JPG, PNG, and GIF files are allowed' });
            }
        }

        const media = files.map(file => ({
            filename: file.filename,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size
        }));

        // Create event in database
        const newEvent = await models.Event.create({
            name,
            description,
            media, // Store file information in the media field
            eventType,
            industry,
            eventDate,
            contactPersonInfo
        });

        // Call afterCreate method for any post-creation logic
        await this.afterCreate(req, res, newEvent);

        res.status(201).json({success: true , data:newEvent});
    } catch (error) {
        // Remove uploaded files from server if error occurs
        const files = req.files;
        if (files && files.length > 0) {
            for (const file of files) {
                try {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path); // Remove file synchronously
                    }
                } catch (err) {
                    console.error('Error deleting file:', err);
                }
            }
        }

        console.error('Error creating event:', error.message);
        res.status(500).json({ success: false , error: error.message });
    }
   }

    async getAllEvents(req, res) {

        // Handle validation results
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array({ onlyFirstError: true }) });
        }

        await this.list(req, res);
    }

    async eventById(req, res) {

        // Handle validation results
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array({ onlyFirstError: true }) });
        }

        await this.read(req, res);
    }

    async afterCreate(req, res, newObject, transaction) {
        // Send a notification or perform any other post-creation logic
        console.log('New event created:');
    }
}

module.exports = new EventController();
