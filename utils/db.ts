import mongoose from "mongoose";

let isConntected = false; // track the connection status

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConntected) {
    console.log("Already connected to the database");
    return;
  }

  const mongodbUri = process.env.MONGODB_URI;
  if (!mongodbUri) {
    throw new Error("Missing MONGODB_URI");
  }

  try {
    await mongoose.connect(mongodbUri, {
      dbName: "promptforge",
    });

    isConntected = true;
    console.log("Successfully connected to the database");
  } catch (error) {
    console.log("Error connecting to the database", error);
    throw error; // ← add this so signIn knows it failed
  }
};
