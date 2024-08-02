"use client"

import NextError from "next/error"
import { useEffect } from "react"
import BaseException from '~/exceptions/BaseException'
import UnknownException from '~/exceptions/UnknownException'

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {

  useEffect(() => {

    if (!(error instanceof BaseException))
      new UnknownException(JSON.stringify(error))

  }, [error])

  return (
    <html>
      <body>
        {/* This is the default Next.js error component but it doesn't allow omitting the statusCode property yet. */}
        <NextError statusCode={undefined as any} />
      </body>
    </html>
  )
}
