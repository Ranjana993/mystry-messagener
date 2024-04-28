/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { useToast } from '@/components/ui/use-toast'
import { Message } from '@/models/user'
import { acceptSchemaVerification } from '@/schemas/accept-message.schema'
import { ApiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
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

      await axios.post<ApiResponse>("/api/accept-message", { acceptMessages:!acceptMessages })

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



  return (
    <div>

    </div>
  )
}

export default Dashboard