"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

import DefaultLayout from "./Default"
import eventEmitter from '~/helpers/eventEmitter'
import { TRole } from '~/plugins/api'
import ImplementationException from '~/exceptions/ImplementationException'

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  const handleLogout = (role: TRole) => {
    throw new ImplementationException('[API] handleLogout Not Implmented')
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
