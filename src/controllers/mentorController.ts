import { Request, Response, NextFunction } from "express"
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import Mentor from "../models/mentorModel";
import Student from "../models/studentModel";
import Recommendation from "../models/recommendationModel";

const mentorSignup = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await Mentor.findOne({ email: email });
        if (!existingUser) {
            const hash = await bcrypt.hash(password, 10);
            Mentor.create({ name, email, password:hash }).then((mentor) => {
                res.status(200).send({
                    success: true,
                    message: 'Student has been successfully signed up!',
                    data: {
                        _id: mentor._id,
                        name: mentor.name,
                        email: mentor.email
                    }
                })
            })
        } else {
            res.status(402).send({
                success: false,
                message: 'User already exists. Try with another email.',
                data: {
                    email: email
                }
            })
        }
    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: `Error:${error}`
        })
    }
}

const mentorLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await Mentor.findOne({ email: email });
    if (existingUser) {
        const passCheck = await bcrypt.compare(password, existingUser.password);
        if (passCheck) {
            const token = jwt.sign({ id: existingUser._id }, process.env.JWT_MENTOR_SECRET!);
            res.status(200).cookie('isLogin', token).cookie('mentorId', existingUser._id).send({
                success: true,
                message: 'Student has been successfully logged in!',
                data: {
                    _id: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email
                }
            })
        } else {
            res.send({
                success: false,
                message: 'Incorrect Password',
                data: {
                    email: existingUser.email
                }
            })
        }
    } else {
        res.send({
            success: false,
            message: 'User does not exist'
        })
    }

}

const mentorProtect = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.isLogin;
    let decoded = jwt.verify(token, process.env.JWT_MENTOR_SECRET!) as {id:string};
    if (decoded) {
        next();
    } else {
        res.send({
            success: false,
            message: 'Login verification failed. Please login again',
        })
    }
}

const getStudents = async (req:Request, res:Response)=> {
    const students = await Student.find({}).select('name email');
    res.status(200).send({
        success:true,
        message:'Students successfully extracted',
        data:{students}
    })
}

const recommendStudent = async (req:Request, res:Response)=> {
    const id = req.params.id;
    const mentorId = req.cookies.mentorId;
    const student = await Student.findOne({_id:id});
    if(student) {
        const recommendation = {
            mentor:mentorId,
            student:id,
            remarks:req.body.remarks
        }
       Recommendation.create(recommendation).then((data)=> {
        res.status(200).send({
            success:true,
            message:'Student has been recommended',
            data:data
        })
       })
    }
}

export {
    mentorSignup,
    mentorLogin,
    mentorProtect, 
    getStudents,
    recommendStudent
}