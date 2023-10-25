import mongoose from "mongoose";

interface remark {
    student:mongoose.Types.ObjectId,
    rating: number,
    review: string
}

const remarkSchema = new mongoose.Schema<remark>({
    student:mongoose.Types.ObjectId,
    rating:{
        type:Number,
        min:0,
        max:5
    },
    review:String
})

interface mentor  {
    name: string,
    email: string,
    password: string,
    remarks: remark[]
    totalRatings: number,
    ratingsCount: number
}

const mentorSchema = new mongoose.Schema<mentor>({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    remarks:{
        type:[remarkSchema],
        default:[]
    },
    totalRatings:{
        type:Number,
        default:0
    },
    ratingsCount:{
        type:Number,
        default:0
    }
})

const Mentor = mongoose.model<mentor>('mentors', mentorSchema);
export default Mentor;