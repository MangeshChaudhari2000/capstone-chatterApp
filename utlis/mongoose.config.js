import mongoose from "mongoose";

export const connectToMongoDB = async () => {
    mongoose.connect('mongodb+srv://mvchaudhari2000:AAuGE4R93CZSER3v@cluster0.htvl9ra.mongodb.net/ChatterApp');
        console.log("Db is connected");
}


