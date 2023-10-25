import mongoose from "mongoose";
import Mentor from "./mentorModel";
import Student from "./studentModel";

interface recommendation {
    mentor:mongoose.Schema.Types.ObjectId,
    student:mongoose.Schema.Types.ObjectId,
    remarks:string
}

const letterSchema = new mongoose.Schema<recommendation>({
    mentor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Mentor
    },
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Student
    },
    remarks:{
        type:String
    }
})

const Recommendation = mongoose.model<recommendation>('recommendations', letterSchema);

export default Recommendation;
 