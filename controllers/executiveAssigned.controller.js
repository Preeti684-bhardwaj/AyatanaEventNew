// require('dotenv').config();
// import { AccessToken } from 'livekit-server-sdk';
// const BaseController = require('./base');
// const models = require('../models');
// const { Op } = require('sequelize');
// class ExecutiveAssignedController extends BaseController {
//     constructor() {
//         super(models.ExecutiveAssigned);
// 	this.router.post('/generate-token', this.fetchToken.bind(this));
// 	//this.router.post('/list', this.listWithReferences.bind(this));
//     }
//     //async listWithReferences(req, res) {
//     //   	res.status(500).json({ error: 'test' });
//     //}
// 	listArgVerify(req,res,queryOptions)
//         {
//                 // Check if 'include' exists and is an array
//                 if (!queryOptions.include || !Array.isArray(queryOptions.include)) {
//                         throw new Error("Invalid or missing 'include' attribute in the query options.");
//                 }

//                 // Iterate over the 'include' array
//                 queryOptions.include.forEach(includeItem => {
//                 // Assume the 'model' property contains the model's name as a string for the comparison
//                 if (includeItem.as && includeItem.as === 'Executives') {
//                                 throw new Error("Including the 'Executive' model is not allowed.");
//                         }
//                 });
// 		queryOptions.where =  {ExecutiveId:{[Op.eq]:req.body.user.id}};
//                 /*queryOptions.include.push(
// 			{ 
// 				model: models.Executive,
// 				atributes:['id'],
// 				where: {id:{[Op.eq]:req.body.user.id}}
// 			});*/
//         }
// 	async afterCreate(req,res,newObject,transaction)
//         {
// 		const newData = req.body;
// 		const EventId = newData['EventId'];
// 		const ExhibitorBrandId = newData['ExhibitorBrandId'];
//           	if (EventId) {
// 			const associatedInstance = await models.Event.findByPk(EventId, { transaction });
//             		if (!associatedInstance) {
//               			throw new Error(`${models.Event.name} with ID ${EventId} not found`);
//             		}
// 			await newObject.addEvent(associatedInstance,{transaction});
// 		}
// 		if (ExhibitorBrandId) {
// 			const associatedInstance = await models.ExhibitorBrand.findByPk(ExhibitorBrandId, { transaction });
//             		if (!associatedInstance) {
//               			throw new Error(`${models.ExhibitorBrand.name} with ID ${ExhibitorBrandId} not found`);
//             		}
// 			await newObject.addExhibitorBrand(associatedInstance,{transaction});
// 		}
// 	}
// 	async fetchToken(req,res)
// 	{
// 		proxyRequest(req,res,"http://localhost:3099/getToken");
// 	}
// }

// module.exports = new ExecutiveAssignedController();
