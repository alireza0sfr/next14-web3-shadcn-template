"use client"

import { useEffect } from "react"

import DefaultLayout from "./Default"
import eventEmitter from '~/helpers/eventEmitter'
import { TRole } from '~/plugins/api'
import { useUser } from '~/hooks/user/user'


export default function Layout({ children, }: Readonly<{ children: React.ReactNode }>) {

  const { logout } = useUser()

  const handleLogout = (role: TRole) => {
    logout()
  }

  // This is used to catch events from axiosInstance when user is unauthorized, in order to disconnect wallet
  useEffect(() => {

    eventEmitter.on("unauthorized", handleLogout)

    // Clean up the event listener on component unmount
    return () => {
      eventEmitter.off("unauthorized", handleLogout)
    }
  }, [])

  return (
    <>
      <DefaultLayout>{children}</DefaultLayout>
    </>
  )
}
