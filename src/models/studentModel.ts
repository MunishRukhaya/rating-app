import mongoose from "mongoose";

interface student  {
    name: string,
    email: string,
    password: string,
}

const studentSchema = new mongoose.Schema<student>({
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
    }
})

const Student = mongoose.model<student>('students', studentSchema);

export default Student;