import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const freelancerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true },
  password: { type: String, select: false, minlength: 8 },
  googleId: { type: String, unique: true, sparse: true },
  phone: { type: String, trim: true, maxlength: 40 },
  avatarUrl: { type: String, trim: true },
  verificationStatus: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" },
  role: { type: String, default: "freelancer", immutable: true },
  accountType: { type: String, default: "freelancer", immutable: true },
}, { timestamps: true });

freelancerSchema.pre("save", async function hashPassword() {
  if (this.isModified("password") && this.password) this.password = await bcrypt.hash(this.password, 12);
});
freelancerSchema.methods.comparePassword = function comparePassword(password) { return bcrypt.compare(password, this.password); };

export const Freelancer = mongoose.model("Freelancer", freelancerSchema);
