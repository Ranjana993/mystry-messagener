import userModel from "@/models/user"
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/utils/sendVerificationEmail"
import { dbConnect } from "@/lib/dbConnection";



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

    const existingUserByEmail = await userModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json({
          success: false,
          message: "User aleady exists with this email "
        },
          {
            status: 400
          }
        )
      }
      else {
        const hashedPassword = await bcrypt.hash(password, 10)
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
        await existingUserByEmail.save();
      }
    }
    else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date()
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new userModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        isVerified: false,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        messages: []
      })
      await newUser.save()
    }
    // send verification email
    const emailRes = await sendVerificationEmail({ email, username, verifyCode })

    if (!emailRes.success) {
      return Response.json({
        success: false,
        message: emailRes.message
      },
        {
          status: 500
        }
      )
    }
    return Response.json({
      success: true,
      message: "User registered successfully , please verify your email address"
    },
      {
        status: 201
      }
    )
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
















