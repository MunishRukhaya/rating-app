import { Request, Response, NextFunction } from "express"
import Student from "../models/studentModel"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Mentor from "../models/mentorModel";
import Recommendation from "../models/recommendationModel";

const studentSignup = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await Student.findOne({ email: email });
        if (!existingUser) {
            const hash = await bcrypt.hash(password, 10);
            Student.create({ name, email, password: hash }).then((student) => {
                res.status(200).send({
                    success: true,
                    message: 'Student has been successfully signed up!',
                    data: {
                        _id: student._id,
                        name: student.name,
                        email: student.email
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

const studentLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await Student.findOne({ email: email });
    if (existingUser) {
        const passCheck = await bcrypt.compare(password, existingUser.password);
        if (passCheck) {
            const token = jwt.sign({ _id: existingUser._id }, process.env.JWT_STUDENT_SECRET!);
            res.status(200).cookie('isLogin', token).cookie('studentId', existingUser._id).send({
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
                message: 'Incoreect Password',
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

const studentProtect = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.isLogin;
    const decoded = jwt.verify(token, process.env.JWT_STUDENT_SECRET!) as { id: string };
    if (decoded) {
        next();
    } else {
        res.send({
            success: false,
            message: 'Login verification failed. Please login again',
        })
    }
}

const getMentors = async (req: Request, res: Response) => {
    const mentors = await Mentor.find({}).select('name email remarks totalRatings ratingsCount');
    const totalRating = mentors.forEach
    res.send({
        success: true,
        message: 'All mentors list extracted.',
        data: {mentors}
    });
}

const getRecommendations = async (req: Request, res: Response) => {
    const studentId = req.cookies.studentId;
    const recommendations = await Recommendation.find({ student: studentId }).populate('mentor', 'name email -_id').select('-student');
    res.status(200).send({
        success: true,
        message: "Recommendations successfully fetched",
        data: {recommendations}
    })
}

const getRecommendationById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const recommendation = await Recommendation.findById(id).populate('mentor', 'name email').populate('student', 'name email -_id');
    res.status(200).send({
        success: true,
        message: "Recommendation successfully fetched",
        data: recommendation
    })
}

const rateMentor = async (req: Request, res: Response) => {
    const mentorId = req.params.id;
    const mentor = await Mentor.findById(mentorId);
    if (mentor) {
        const remark = {
            student: req.cookies.studentId,
            rating: req.body.rating,
            review: req.body.review
        }
        mentor.remarks.push(remark)
        mentor.ratingsCount += req.body.rating;
        mentor.totalRatings += 1;
        mentor.save().then((data) => {
            res.status(200).send({
                success: true,
                message: "Rated and reviewed successfully",
                data: {
                    rating: req.body.rating,
                    review: req.body.review
                }
            })
        })
    }
}

export {
    studentSignup,
    studentLogin,
    studentProtect,
    getMentors,
    getRecommendations,
    getRecommendationById,
    rateMentor
}