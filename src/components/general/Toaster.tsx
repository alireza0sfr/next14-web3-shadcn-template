'use client'

import { toast, Toaster, ToastBar } from 'react-hot-toast'

export default function Toast() {
  return (
    <Toaster>
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              {icon}
              {message}
              {t.type !== 'loading' && (
                <div onClick={() => toast.dismiss(t.id)} className="h-[40px] w-[40px] flex-shrink-0 flex items-center justify-center cursor-pointer text-xl p-2 opacity-70 rounded-full z-50 text-gray-200 bg-gray-100/[.1]">X</div>
              )}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  )
}