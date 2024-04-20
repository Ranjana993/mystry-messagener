import mongoose, { Schema, Document } from "mongoose"

export interface Message extends Document {
  content: string;
  createdAt: Date
}

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  isVerified:boolean;
  verifyCodeExpiry: Date;
  isAcceptingMessages: boolean;
  messages: Message[]
}

const messageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
})


const userSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required and must be unique"],
    unique: true
  },
  email: {
    type: String,
    required: [true, "Email is required "],
    unique: true,
    match: [/.+\@.+\..+/, "please use a valid email address"]
  },
  password: {
    type: String,
    required: [true, "Password is required "],
  },
  verifyCode: {
    type: String,
    required: [true, "verify code is required "],
  },
  isVerified:{
    type:Boolean,
    default: false
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify Code Expiry is required "],
    default: Date.now
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true
  },
  messages: [messageSchema]
})


const userModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User" , userSchema)

export default userModel


