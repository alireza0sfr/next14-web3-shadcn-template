import { ToastOptions, ValueOrFunction, Renderable, Toast } from 'react-hot-toast'

type Message = ValueOrFunction<Renderable, Toast>

export type ToastHandler = (msg: Message, options?: ToastOptions) => void