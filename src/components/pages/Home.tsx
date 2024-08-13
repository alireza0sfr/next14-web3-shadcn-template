'use client'

import { Button } from '~/components/ui/button'
import { toastSuccess } from '~/plugins/toast'

export default function HomeComponent() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <Button
          onClick={() => {
            toastSuccess('ShadCn Works!!')
          }}
        >Click Me</Button>
      </div>
    </main>
  )
}
