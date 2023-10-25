import { Router } from "express";
import { getStudents, mentorProtect, recommendStudent } from "../controllers/mentorController";

const mentorRouter = Router();
mentorRouter.use(mentorProtect);

mentorRouter.get('/students', getStudents);
mentorRouter.post('/student/recommend/:id', recommendStudent); 

export default mentorRouter;