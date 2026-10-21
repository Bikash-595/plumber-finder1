import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true },
  password: { type: String, required: true, select: false, minlength: 8 },
  // Deactivated admins cannot sign in or use admin APIs, even with an unexpired token.
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date },
  role: { type: String, default: "admin", immutable: true },
  accountType: { type: String, default: "admin", immutable: true },
}, { timestamps: true, collection: "admins" });

adminSchema.pre("save", async function hashPassword() {
  if (this.isModified("password") && this.password) this.password = await bcrypt.hash(this.password, 12);
});
adminSchema.methods.comparePassword = function comparePassword(password) { return bcrypt.compare(password, this.password); };

export const Admin = mongoose.model("Admin", adminSchema);
