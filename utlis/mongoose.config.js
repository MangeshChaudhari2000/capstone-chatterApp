import mongoose from "mongoose";

export const connectToMongoDB = async () => {
    await mongoose.connect("mongodb://localhost:27017/chatterUp", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("Db is connected");
}
