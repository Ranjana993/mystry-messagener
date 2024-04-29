/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { Message } from '@/models/user'
import { acceptSchemaVerification } from '@/schemas/accept-message.schema'
import { ApiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import { basename } from 'path'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'








const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const { toast } = useToast()


  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message?._id !== messageId))
  }

  const { data: session } = useSession()
  const form = useForm({
    resolver: zodResolver(acceptSchemaVerification),
  })

  const { register, setValue, watch } = form
  const acceptMessages = watch('acceptMessages')


  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const res = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessages', res.data.isAcceptingMessages)


    }
    catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch message setting",
        variant: "destructive"
      })
    }
    finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])




  const fetchMessage = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(false);

    try {
      const res = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(res.data.messages || []);
      if (refresh) {
        toast({
          title: "Refreshed messages",
          description: "Showing latest messages"
        })
      }
    }
    catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch message setting",
        variant: "destructive"
      })
    }
    finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }

  }, [setIsLoading, setMessages])


  useEffect(() => {

    if (!session || !session.user) {
      return
    }
    fetchMessage()
    fetchAcceptMessage()
  }, [session, setValue, fetchAcceptMessage, fetchMessage, setIsSwitchLoading])

  // handling switch changes




  const handleSwitchChange = async () => {
    try {

      const res = await axios.post<ApiResponse>("/api/accept-message", { acceptMessages: !acceptMessages })

      setValue("acceptMessages", !acceptMessages)

      toast({
        title: res.data.message,
        variant: "default"
      })

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch message setting",
        variant: "destructive"
      })
    }
    finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }


  const baseURL = `${window.location.protocol}//${window.location.host}`
  console.log("session.....",session);
  
  const { username } = session?.user as User
  const profileURL = `${baseURL}/u/${username}`

  const copyToClipBoard = () => {
    navigator.clipboard.writeText(profileURL)
    toast({
      title: "Copied",
      description: "Proile url has been copied to clipboard",
      variant: "default"
    })
  }



  if (!session || !session.user) {
    return <div> Please login</div>
  }

  return (
    <div className='my-8 mx-4 mb:mx-8 lg:mx-auto p-6 bg-white rounded-full max-w-6xl'>
      <h1 className='text-4xl font-bold mb-4' >User Dashboard </h1>
      <div className='mb-4'>
        <h2 className='text-lg font-semibold mb-2'>Copy your Unique Link </h2>
        <div className='flex items-center'>
          <input
            type='text'
            value={profileURL}
            disabled
            className='input input-bordered w-full p-2 mr-2'
          />
          <button onClick={copyToClipBoard}>Copy</button>
        </div>

      </div>
      <div className='mb-4'>
        {/* switch */}
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className='ml-2'>
          Accept Messages {acceptMessages ? 'ON' : 'OFF'}
        </span>
      </div>
      <Separator />
      <Button
        className='mt-4'
        variant={'outline'}
        onClick={(e) => {
          e.preventDefault()
          fetchMessage(true)
        }}
      >
        {
          isLoading ? (
            <Loader2 className='h-4 w-4 animate-spin' />) : (
            <RefreshCcw className='h-4 w-4' />
          )
        }
      </Button>
      <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
        {
          messages.length > 0 ? (
            messages.map((msg, index) => (
              <Card
                key={index}
                CardTitle={msg}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          )
            : (
              <p>No messages to display</p>
            )
        }
      </div>
    </div>
  )
}

export default Dashboard 