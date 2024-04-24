import { z } from "zod"
import userModel from "@/models/user"
import { dbConnect } from "@/lib/dbConnection"
import { usernameValidation } from "@/schemas/sign-up.schema"

const usernameQuerySchema = z.object({
  username: usernameValidation
})


export async function GET(request: Request) {
  await dbConnect()
  try {
    const { searchParams } = new URL(request.url)
    const queryParam = {
      username: searchParams.get("username")
    }
    // validating with zod
    const res = usernameQuerySchema.safeParse(queryParam)
    if (!res.success) {
      const usernameError = res.error.format().username?._errors || [];
      return Response.json({
        success: false,
        message: usernameError?.length > 0 ? usernameError : "invalid username query parameter" 
      },
        {
          status: 500
        })
    }
    const { username } = res.data
    
    const existingVerifiedUser = await userModel.findOne({ username, isVerified: true })

    
    if (existingVerifiedUser) {
      return Response.json({
        success: false,
        message: "Username is alreay taken"
      },
        {
          status: 500
        }
      )
    }
    return Response.json({
      success: false,
      message: "Username is  available"
    },
      {
        status: 400
      }
    )
  } catch (error) {
    console.log("Error checking while checking username ")
    return Response.json({
      success: false,
      message: "Error while checking username"
    },
      {
        status: 500
      }
    )
  }
}