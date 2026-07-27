import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true, trim: true, maxlength: 150 },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true },
  password: { type: String, select: false, minlength: 8 },
  googleId: { type: String, unique: true, sparse: true },
  phone: { type: String, trim: true, maxlength: 40 },
  avatarUrl: { type: String, trim: true },
  status: { type: String, enum: ["pending", "approved", "suspended"], default: "pending" },
  role: { type: String, default: "company", immutable: true },
  accountType: { type: String, default: "company", immutable: true },
}, { timestamps: true });

companySchema.pre("save", async function hashPassword() {
  if (this.isModified("password") && this.password) this.password = await bcrypt.hash(this.password, 12);
});
companySchema.methods.comparePassword = function comparePassword(password) { return bcrypt.compare(password, this.password); };

export const Company = mongoose.model("Company", companySchema);
