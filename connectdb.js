import mongoose from "mongoose";

async function connectDB(){
    try {
        await mongoose.connect("mongodb+srv://codehuda:SA0MbCfJw3yQDqX2@huda.w8ghoqr.mongodb.net/hotelDB")

        console.log("Mongodb is connected");
    } catch (error) {
        console.log(error);
    }
}

connectDB(); 
