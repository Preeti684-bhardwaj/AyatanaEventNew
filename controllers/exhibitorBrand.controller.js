const BaseController = require('./base');
const models = require('../models');
const { Op } = require('sequelize');
const upload = require("../middleware/multer.middleware.js")
const path = require("path")
const { validationResult } = require("express-validator")
const { validateCreateExibitorBrands } = require("../validations/exibitorBrands.validation.js")
const fs = require("fs")

class ExhibitorBrandController extends BaseController {
	constructor() {
		super(models.ExhibitorBrand);
        this.router.post('/:eventId', upload.array("media"), validateCreateExibitorBrands ,  this.createExhibitorBrand.bind(this));
	}
	listArgVerify(req,res,queryOptions)
	{
	}
	async afterCreate(req,res,newObject,transaction)
        {
            console.log("New Object")
        }
    
     // Custom methods
     async createExhibitorBrand(req, res) {
        try {
            const { eventId } = req.params;
            const { name , contactPersonInfo } = req.body;

            // Handle validation results
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array({ onlyFirstError: true }) });
            }

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

            // Find the related event
            const event = await models.Event.findByPk(eventId);
            if (!event) {
                return res.status(404).json({ success: false, error: 'Event not found' });
            }

            // Create exhibitor brand in database
            const newExhibitorBrand = await models.ExhibitorBrand.create({
                name,
                media, // Store file information in the media field
                contactPersonInfo,
                EventId: event.id // Set the foreign key to associate with the event
            });

            // Call afterCreate method for any post-creation logic
            await this.afterCreate(req, res, newExhibitorBrand);

            res.status(201).json({success: true , data: newExhibitorBrand});
        } catch (error) {
            console.error('Error creating exhibitor brand:', error.message);
            // Remove uploaded file from server if error occurs
            const file = req.file;
            if (file) {
                try {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path); // Remove file synchronously
                    }
                } catch (err) {
                    console.error('Error deleting file:', err);
                }
            }
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ExhibitorBrandController();
