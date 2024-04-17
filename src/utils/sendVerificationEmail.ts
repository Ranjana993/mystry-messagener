import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail"
import { ApiResponse } from "@/types/apiResponse";



export async function sendVerificationEmail({ email: string, username: string, verifycode: string }): Promise<ApiResponse> {

  try {

    await resend.emails.send({
      from: 'you@example.com',
      to: email,
      subject: 'Verification code',
      react: VerificationEmail({ username, otp: verifycode }),
    });

    return { success: true, message: "Verification email sent successfully " }
  } catch (error: any) {
    console.log("error sending verification email...", error.message);
    return { success: false, message: "Verification email error failed to send verification email " }
  }
}







