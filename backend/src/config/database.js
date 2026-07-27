import mongoose from "mongoose";

export async function connectDatabase() {
  const connectionString = process.env.MONGODB_URI;
  if (!connectionString) throw new Error("MONGODB_URI is required. Copy backend/.env.example to backend/.env and set it.");
  await mongoose.connect(connectionString);
  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
}
