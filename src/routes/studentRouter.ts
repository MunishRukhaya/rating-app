import { Router } from "express";
import { getMentors, getRecommendationById, getRecommendations, rateMentor, studentProtect } from "../controllers/studentController";

const studentRouter = Router();
studentRouter.use(studentProtect);

studentRouter.get('/mentors', getMentors);
studentRouter.get('/recommendations', getRecommendations);
studentRouter.get('/recommendation/:id', getRecommendationById);
studentRouter.post('/mentor/:id/rate', rateMentor)

export default studentRouter;