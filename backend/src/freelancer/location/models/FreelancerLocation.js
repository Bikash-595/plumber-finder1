import mongoose from "mongoose";

// Where the freelancer is based on the map: the address, exact coordinates, and how far they travel.
const freelancerLocationSchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true, unique: true },
  headquarters: { type: String, trim: true, maxlength: 300 },
  latitude: { type: Number, min: -90, max: 90 },
  longitude: { type: Number, min: -180, max: 180 },
  serviceRadius: { type: Number, min: 0, max: 500 },
  mapUrl: { type: String, trim: true, maxlength: 500 },
}, { timestamps: true, collection: "freelancer_location" });

export const FreelancerLocation = mongoose.model("FreelancerLocation", freelancerLocationSchema);
