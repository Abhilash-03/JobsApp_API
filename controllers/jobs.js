const { NotFoundError, BadRequestError } = require('../errors');
const Job = require('../models/Job');
const {StatusCodes} = require('http-status-codes');


const getAllJobs = async (req, res) => {
    // That person who is authencticated to that associated data only that person can fetch the data. That's why we find the data by his/her userId.
    const jobs = await Job.find({createdBy: req.user.userId}).sort('createdAt');
    res.status(StatusCodes.OK).json({jobs, count: jobs.length});
}
const getJob = async(req, res) => {
   const {user: {userId}, params: {id: jobId}} = req
   const job = await Job.findOne({_id: jobId, createdBy: userId});
   
   if(!job){
    throw new NotFoundError(`No job found with id ${jobId}`)
}
   res.status(StatusCodes.OK).json({job});
}
const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({job});
}
const updateJob = async(req, res) => {
    const {body: {company, position}, user: {userId}, params:{id: jobId} } = req;

    if(company === '' || position === ''){
        throw new BadRequestError("Company and Position value should not be empty.");
    }

    const job = await Job.findByIdAndUpdate({_id: jobId, createdBy: userId}, req.body, {new: true, runValidators: true});

    if(!job){
        throw new NotFoundError(`No such job found with id: ${jobId}`);
    }

    res.status(StatusCodes.OK).json({job});
}
const deleteJob = async(req, res) => {
    const {user: {userId}, params: {id: jobId}} = req;

    const job = await Job.findByIdAndRemove({_id: jobId, createdBy: userId});

    if(!job){
        throw new BadRequestError(`No such job found with id: ${jobId}`)
    }
    res.status(StatusCodes.OK).send("Deleted Successfully!!!");


}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}