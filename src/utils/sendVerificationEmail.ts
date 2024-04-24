import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/apiResponse";



export async function sendVerificationEmail({ email, username, verifyCode }): Promise<ApiResponse> {
  try {
    const data = await resend.emails.send({
      from: 'yranjana757@gmail.com',
      to: email,
      subject: 'Verification code',
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    console.log("data ofemail send ", data);
    
    console.log("email ", email, "username", username, "verifyCode", verifyCode);
    console.log("Success");

    return { success: true, message: "Verification email sent successfully" };
  }
  catch (error: any) {
    console.error("Error sending verification email:", error.message);
    return { success: false, message: "Failed to send verification email" };
  }
}

