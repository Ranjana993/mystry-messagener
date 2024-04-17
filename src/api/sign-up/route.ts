import dbConnect from "@/lib/dbConnection"
import userModel from "@/models/user"
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/utils/sendVerificationEmail"



export async function POST(req: Request) {
  await dbConnect()
  try {
    const data = await req.json();
    const { username, email, password } = data;
    const existingUserVerifiedByUserName = await userModel.findOne({
      username, isVerified: true
    })
    if (existingUserVerifiedByUserName) {
      return Response.json({
        success: false,
        message: "Username is already has been taken "
      }, { status: 400 })
    }
    

  } catch (error) {
    console.log("Error while regestering user ");
    return Response.json({
      success: false,
      mesasge: "error while regestering user",
    },
      {
        status: 500
      })
  }
}
















