import { dbConnect } from "@/lib/dbConnection";
import userModel from "@/models/user";

export async function POST(request: Request) {
  await dbConnect()
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username)
    const user = await userModel.findOne({ username: decodedUsername });
    console.log(user);
    
    if (!user) {
      return Response.json({
        success: false,
        message: "User not found"
      },
        {
          status: 500
        }
      )
    }
    const isCodeValid = user.verifyCode === code
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true
      return Response.json({
        success: true,
        message: "User has been verified"
      },
        {
          status: 200
        }
      )
    }
    else if (!isCodeNotExpired) {
      return Response.json({
        success: false,
        message: "Verification code has expired please sign up again "
      },
        {
          status: 500
        }
      )
    }else{
      return Response.json({
        success: false,
        message: "Incorrect verification code "
      },
        {
          status: 400
        }
      )
    }

  } catch (error) {
    console.log("Error while verifying user", error)
    return Response.json({
      success: false,
      message: "Error while verifying user"
    },
      {
        status: 500
      }
    )
  }
}