import { dbConnect } from "@/lib/dbConnection";
import userModel from "@/models/user";
import { Message } from "@/models/user";


export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();

  try {
    const user = await userModel.findOne({ username });

    if (!user) {
      return Response.json({
        message: "user not found",
        success: false
      }, { status: 402 })
    }

    // is user accepting the message....
    if (!user.isAcceptingMessage) {
      return Response.json({
        message: "user is not accepting the messsages",
        success: false
      }, { status: 403 })
    }

    const newMessage = {
      content,
      createdAt: new Date()
    }
    user.messages.push(newMessage as Message);
    await user.save();
    return Response.json({
      message: "Message sent successfully",
      success: true
    }, { status: 200 })
  }
  catch (error) {
    return Response.json({
      success: false,
      message: "not authenticated",
    }, { status: 500 })
  }





}

