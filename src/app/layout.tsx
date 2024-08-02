import type { Metadata } from "next"
import { Inter } from "next/font/google"
import ReactQueryProvider from "~/providers/ReactQueryProvider"

import Toast from "~/components/general/Toaster"
import Layout from "~/layouts/Layout"

import "~/styles/globals.css"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>

        <ReactQueryProvider>
          <Toast />

          <Layout>{children}</Layout>
        </ReactQueryProvider>

      </body>
    </html>
  )
}
