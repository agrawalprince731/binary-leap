import express from "express"
import asyncHandler from "../../utils/asyncHandler"
import * as adminControllers from "../../controllers/auth.controller"
import * as candidateControllers from "../../controllers/candidate.controller"
import * as interviewBatchControllers from "../../controllers/interviewBatch.controller"
import { authMiddleware } from "../../middlewares/authenticate"

const router=express.Router()

router.post("/login",asyncHandler(adminControllers.login))
router.post("/sign-up",asyncHandler(adminControllers.signup))
router.get("/get-user",authMiddleware,asyncHandler(adminControllers.getUser))


router.post("/add-candidate",asyncHandler(candidateControllers.createCandidate))
router.get("/candidates",asyncHandler(candidateControllers.getAllBatchCandidates))
router.get("/candidates/analytics",asyncHandler(candidateControllers.getCandidateAnalytics))

router.get("/batches",asyncHandler(interviewBatchControllers.getAllBatches))
router.post("/batches/create",asyncHandler(interviewBatchControllers.createBatch))

export default router