// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const BaseController = require('./base');
// const models = require('../models');
// const { Op } = require('sequelize');


// const generateToken = (user) => {
//     return jwt.sign({ obj: user }, process.env.JWT_SECRET, {
//         expiresIn: '72h', // expires in 24 hours
//     });
// };


// class ExecutiveController extends BaseController {
// 	constructor() {
// 		super(models.Executive);
// 		this.router.post('/signup', this.signup.bind(this));
// 		this.router.post('/signin', this.signin.bind(this));
// 	}
// 	listArgVerify(req,res,queryOptions)
// 	{ 
// 	}
// 	async afterCreate(req,res,newObject,transaction)
//         {
//         }


// 	signup = async (req, res) => {
// 		try {
// 			const { email, password } = req.body;
// 			const existingUser = await models.Executive.findOne({ where: { email } });

// 			if (existingUser) {
// 				return res.status(400).send({ message: "Email is already in use." });
// 			}

// 			const hashedPassword = await bcrypt.hash(password, 10);
// 			const emailToken = generateToken({ email }); // This should ideally be a different token, specific for email verification

// 			const executive = await models.Executive.create({
// 				email,
// 				password: hashedPassword,
// 				emailToken,
// 				// Additional fields as necessary
// 			});

// 			//sendVerificationEmail(email, emailToken);

// 			res.status(201).send({
// 				id: executive.id,
// 				email: executive.email,
// 				// Add additional fields as necessary
// 			});
// 		} catch (error) {
// 			res.status(500).send({
// 				message: error.message || "Some error occurred during signup."
// 			});
// 		}
// 	};

// 	signin = async (req, res) => {
// 		const { email, password } = req.body;

// 		try {
// 			const executive = await models.Executive.findOne({ where: { email } });
// 			if (!executive) {
// 				return res.status(404).send({ message: "Executive not found." });
// 			}
// 			//if (!executive.IsActivated) {
// 			//	return res.status(401).json({ message: "Executive not found" });
// 			//}
// 			//if (!executive.IsEmailVerified) {
// 			//    return res.status(401).json({ message: "Email not verified" });
// 			//}


// 			const isPasswordValid = await bcrypt.compare(password, executive.password);
// 			if (!isPasswordValid) {
// 				return res.status(403).send({ message: "Invalid password." });
// 			}


// 			const obj = {
// 				type:'EXECUTIVE',
// 				id:executive.id,
// 				email:executive.email
// 			};

// 			const token = generateToken(obj);

// 			res.status(200).send({
// 				id:executive.id,
// 				token:token
// 			});

// 		} catch (error) {
// 			res.status(500).send({
// 				message: error.message || "Some error occurred during signin."
// 			});
// 		}
// 	};

// 	verifyEmail = async (req, res) => {
// 		const { token } = req.query;

// 		try {
// 			const decoded = jwt.verify(token, process.env.JWT_SECRET);
// 			const executive = await models.Executive.findByPk(decoded.id);

// 			if (!executive) {
// 				return res.status(404).send({ message: "Executive not found." });
// 			}

// 			executive.IsEmailVerified = true;
// 			executive.IsActivated = true;
// 			await executive.save();

// 			res.status(200).send({ message: "Email verified successfully." });
// 		} catch (error) {
// 			res.status(500).send({
// 				message: error.message || "Could not verify email."
// 			});
// 		}
// 	};
// }

// module.exports = new ExecutiveController();
