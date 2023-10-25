import { Router } from "express";
import { studentLogin, studentSignup } from "../controllers/studentController";
import { mentorLogin, mentorSignup } from "../controllers/mentorController";

const authRouter = Router();

authRouter.post('/student/signup',studentSignup);
authRouter.post('/student/login', studentLogin);

authRouter.post('/mentor/signup', mentorSignup);
authRouter.post('/mentor/login', mentorLogin);

export default authRouter;