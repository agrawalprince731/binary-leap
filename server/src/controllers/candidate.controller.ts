import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import Admin from "../models/admin";
import Candidate from "../models/candidates";
import { adminId, batchId } from "../utils/fixed";
import axios from 'axios';
import Batch from "../models/batches";

const fetchAnalyses=async(transcript:string)=>{
    const batch=await Batch.findById(batchId);
    if(!batch){
        throw new AppError("Batch not found",404);
    }
    const job_description=batch.jobDescription;

    const response = await axios.get('http://localhost:8000/analysis', {
        params: {
            transcript,
            job_description
        }
    });
    return response.data;
}

export const createCandidate=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const {transcript, userName,batch}=req.body;

        console.log("Got candidate",transcript,userName)
        if(!transcript || !userName){
            return next(new AppError("Please provide transcript and userName",400));
        }

        const admin= Admin.findById(adminId);

        if(!admin){
            return next(new AppError("Admin not found",404));
        }

        const analyses=await fetchAnalyses(transcript);
        
        const newCandidate= await Candidate.create({
            name:batch,
            batch:batch,
            transcript,
            experience_analysis: analyses.experience_analysis,
            sentimental_analysis: analyses.sentimental_analysis,
            // admin:tempAdminId
        });

        newCandidate.save();
        return res.status(201).json(newCandidate);
    }catch(error:any){
        res.status(500).json({error:error.message});
    }   
}


export const getAllBatchCandidates=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const admin= Admin.findById(adminId);

        if(!admin){
            return next(new AppError("Admin not found",404));
        }
        // batch filter to be applied later
        
        const candidates = await Candidate.find().select("_id name createdAt");
        
        const formattedCandidates = candidates.map(candidate => ({
            _id:candidate._id,
            name: candidate.name,
            interviewDate: candidate.createdAt.toISOString().split('T')[0], // Formatting createdAt as interviewDate
            interviewTime: candidate.createdAt.toISOString().split('T')[1].split('.')[0] // Formatting createdAt as interviewTime
        }));

        res.status(200).json(formattedCandidates);
    }
    catch(error:any){
        res.status(500).json({error:error.message});
    }
}





export const getCandidateAnalytics=async(req:Request,res:Response,next:NextFunction)=>{
    const {candidateId}=req.query

    if(!candidateId){
        return next(new AppError("Please provide candidateId",400));
    }

    const candidate=await Candidate.findById(candidateId);
    
    if(!candidate){
        return next(new AppError("Candidate not found",404));
    }

    const data={
        experience_analysis:candidate.experience_analysis,
        sentimental_analysis:candidate.sentimental_analysis,
        name:candidate.name,
        transcript:candidate.transcript
    }

    res.status(200).json(data);
}