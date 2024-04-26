"use client"
import axios, { AxiosError } from "axios"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signupSchema } from "@/schemas/sign-up.schema"
import { ApiResponse } from "@/types/apiResponse"
import { Form, FormControl,  FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Loader2 } from "lucide-react"

const SignUp = () => {

  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)


  const { toast } = useToast()
  const router = useRouter()
  const debouncedUsername = useDebounceCallback(setUsername, 300)

  //? zod implementation
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })


  useEffect(() => {
    const checkUsernameUniqueness = async () => {
      if (username) {
        setIsCheckingUsername(true)
        setUsernameMessage("")
        try {
          const response = await axios.get(`/api/checkUsernameUnique?username=${username}`)
          console.log("response",response);
          
          let message = response.data.message
          setUsernameMessage(message)
        }
        catch (error) {
          console.log("Error while checking username unique ");
          const axiosError = error as AxiosError<ApiResponse>
          axiosError.response?.data.message ?? "Error checking username"
        }
        finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUniqueness()
  }, [username])

  const onSubmitHandler = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true)

    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data)
      toast({
        title: "Success",
        description: response.data.message
      })
      router.replace(`/verify/${username}`)
      setIsSubmitting(false)
    }
    catch (error) {
      console.error("Error while signing up user", error);
      const axiosError = error as AxiosError<ApiResponse>

      let axiosErrorMessage = axiosError.response?.data.message;
      toast({
        title: "Sign up failed",
        description: axiosErrorMessage,
        variant: "destructive"
      })
      setIsSubmitting(false)
    }
  }


  return (
    <>
      <div className="flex justify-center items-center bg-gray-100 min-h-screen">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join Anonymous Messaganger </h1>
            <p className="mb-6">Explore your Adventure mystrious messages</p>
          </div>
          {/* form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-6">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field}
                        onChange={((e) => {
                          field.onChange(e)
                          debouncedUsername(e.target.value)
                        })}
                      />
                    </FormControl>
                    {isCheckingUsername && <Loader2 className="animate-spin" />}
                    <p className={`text-sm ${usernameMessage ==="Username is  unique" ? 'text-green-500':'text-red-500'}`}>Test {usernameMessage}</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {
                  isSubmitting ? (<> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</>) : " Signup"
                }
              </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p>Already have account?
              <Link href={"/sign-in"} className="text-blue-600 hover:text-blue-800">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignUp