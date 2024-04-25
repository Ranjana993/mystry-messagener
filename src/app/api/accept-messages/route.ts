import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import userModel from "@/models/user";
import { dbConnect } from "@/lib/dbConnection";
import { User } from "next-auth";



export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions)
  const user: User = session?.user as User
  if (!session || !session.user) {
    return Response.json({
      success: false,
      message: "Not Authenticated"
    }, { status: 401 })

  }
  const userId = user._id
  const { acceptMessages } = await request.json()
  try {
    const upadtedUser = await userModel.findByIdAndUpdate(userId, {
      isAcceptingMessage: acceptMessages
    }, { new: true })
    if (!upadtedUser) {
      return Response.json({
        success: false,
        message: "failed to update user status to accept message"
      }, { status: 401 })
    }
    return Response.json({
      success: true,
      message: "Message acceptance status updated successfully", upadtedUser
    }, { status: 200 })


  } catch (error) {
    console.log("failed to update user status to accept message");
    return Response.json({
      success: false,
      message: "failed to update user status to accept message"
    }, { status: 500 })

  }



}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions)
  const user: User = session?.user as User
  if (!session || !session.user) {
    return Response.json({
      success: false,
      message: "Not Authenticated"
    }, { status: 401 })

  }
  const userId = user._id
  const foundUser = await userModel.findById(userId)

  try {
    if (!foundUser) {
      return Response.json({
        success: false,
        message: "User not found "
      }, { status: 404 })
    }
    return Response.json({
      success: true,
      isAcceptingMessage: foundUser.isAcceptingMessage
    }, { status: 200 }
    )
  }
  catch (error) {
    console.log("Error in getting message acceptance");
    return Response.json({
      success: false,
      message: "Error in getting message acceptance"
    }, { status: 500 })

  }
}