import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  id:string;
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  picture?: string;
  loginMethod: "GOOGLE" | "EMAIL";
  role?: "USER" | "ADMIN";
  credits?: number;
  plan?: "FREE" | "PRO";
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    picture: { type: String },
    loginMethod: { type: String, enum: ["GOOGLE", "EMAIL"], required: true },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    credits: { type: Number, default: 5 },
    plan: { type: String, enum: ["FREE", "PRO"], default: "FREE" },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", userSchema);
