import toast from 'react-hot-toast'
import type { Renderable, Toast, ToastOptions, ValueOrFunction } from 'react-hot-toast'
import { ToastHandler } from '~/types/plugins/toast'
import { breakpoints } from '~/hooks/useBreakpoint'

type Message = ValueOrFunction<Renderable, Toast>
export type ToastError = (msg: Message, options?: ToastOptions, sendToSentry?: boolean) => string

export const getOptions = (): ToastOptions => {
  return {
    duration: 4000,
    position: window.innerWidth > parseInt(breakpoints.sm.split('px')[0]) ? 'bottom-left' : 'top-left',

    className: 'toast',
  }
}

export const toastError: ToastError = (msg, options) => {
  options = Object.assign(getOptions(), options)

  return toast.error(msg, options)
}

export const toastSuccess: ToastHandler = (msg, options) => {
  options = Object.assign(getOptions(), options)
  return toast.success(msg, options)
}

const _toast: ToastHandler = (msg, options) => {
  options = Object.assign(getOptions(), options)
  return toast(msg, options)
}

export const toastLoading: ToastHandler = (msg, options): string => {
  options = Object.assign(getOptions(), options)
  return toast.loading(msg, options)
}

export const toastDismiss = (toastId: string) => {
  toast.dismiss(toastId)
}

export const toastPromise = (promise: Promise<any>, loadingMessage: string, successMessage: string, errorMessage: string) => {
  const options = Object.assign({
    success: {
      duration: 4000,
    },
  }, getOptions())

  return toast.promise(
    promise,
    {
      loading: loadingMessage,
      success: (data) => successMessage,
      error: (err) => errorMessage,
    },
    options
  )
}

export default _toast