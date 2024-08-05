import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    image: {
        data:Buffer,
        contentType:String
    },
    password: {
        type: String,
        required: true
    },
    is_online: {
        type: String,
        default: '0'
    }
},
    { timeStamp: true }
)

export const UserModel = mongoose.model('User', userSchema);