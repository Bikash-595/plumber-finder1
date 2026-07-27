import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true },
  password: { type: String, select: false, minlength: 8 },
  googleId: { type: String, unique: true, sparse: true },
  phone: { type: String, trim: true, maxlength: 40 },
  address: { type: String, trim: true, maxlength: 300 },
  avatarUrl: { type: String, trim: true },
  role: { type: String, default: "user", immutable: true },
  accountType: { type: String, default: "user", immutable: true },
}, { timestamps: true });

userSchema.pre("save", async function hashPassword() {
  if (this.isModified("password") && this.password) this.password = await bcrypt.hash(this.password, 12);
});
userSchema.methods.comparePassword = function comparePassword(password) { return bcrypt.compare(password, this.password); };

export const User = mongoose.model("User", userSchema);
