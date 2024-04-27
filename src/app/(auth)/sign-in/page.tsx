"use client"
import axios, { AxiosError } from "axios"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signupSchema } from "@/schemas/sign-up.schema"
import { ApiResponse } from "@/types/apiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import { signinSchemaVerification } from "@/schemas/sign-in.schema"
import { signIn } from "next-auth/react"

const SignUp = () => {

  const [isSubmitting, setIsSubmitting] = useState(false)


  const { toast } = useToast()
  const router = useRouter()


  //? zod implementation
  const form = useForm<z.infer<typeof signinSchemaVerification>>({
    resolver: zodResolver(signinSchemaVerification),
    defaultValues: {
      identifier: "",
      password: ""
    }
  })


  const onSubmitHandler = async (data: z.infer<typeof signinSchemaVerification>) => {
    const res = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })
    if (res?.error) {
      toast({
        title: "login failed",
        description: "Incorrect username or password",
        variant: "destructive"
      })
    }
    if (res?.url) {
      router.replace("/dashboard")
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
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email / Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Email/username" {...field} />
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
                Signin
              </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p>New to this plateform?
              <Link href={"/sign-up"} className="text-blue-600 hover:text-blue-800">Sign up now</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignUp