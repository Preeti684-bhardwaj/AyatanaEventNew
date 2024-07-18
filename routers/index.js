const express = require('express');
const userRouter=require('./User.router')
// const executiveAssignedRouter = require('./executiveAssigned.router');
// const executiveRouter = require('./executive.router');
const eventRouter = require('./event.router');
// const conferenceRouter = require('./conference.router');
const exhibitorBrand = require('./exhibitorBrand.router');
const router = express.Router();
router.use('/user', userRouter);
// router.use('/executive-assigned', executiveAssignedRouter);
// router.use('/executive', executiveRouter);
// router.use('/conference', conferenceRouter);
router.use('/event',eventRouter);
router.use('/exhibitor-brand',exhibitorBrand);
module.exports = router;
 