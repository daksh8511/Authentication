import mongoose from "mongoose";

export const ConnectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/user_data`);
    console.log("Database Are Successfully Connected.");
  } catch (error) {
    console.log("Database Are Not Connected!");
  }
};
