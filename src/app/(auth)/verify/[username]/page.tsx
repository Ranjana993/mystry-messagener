"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { verifySchema } from "@/schemas/verify.schema"
import { ApiResponse } from "@/types/apiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"


const PageVerification = () => {

  const router = useRouter()
  const params = useParams<{ username: string }>()
  const { toast } = useToast()

  //? zod implementation
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: ""
    }
  })


  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const res = await axios.post("/api/verify-code", {
        username: params.username,
        code: data.code
      })
      toast({
        title: "Success",
        description: res?.data?.message
      })
      router.replace("/sign-in")


    } catch (error) {
      console.error("Error while signing up user", error);
      const axiosError = error as AxiosError<ApiResponse>

      let axiosErrorMessage = axiosError.response?.data.message;
      toast({
        title: "verification  failed",
        description: axiosErrorMessage,
        variant: "destructive"
      })
    }
  }



  return (
    <>
      <div className="flex justify-center items-center bg-gray-100 min-h-screen">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight lg:text-3xl mb-6">Verify Your Account </h1>
            <p className="mb-6">Enter the verification code to send to your email</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input placeholder="code" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>



      </div>
    </>
  )
}

export default PageVerification