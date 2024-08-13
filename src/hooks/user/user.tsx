import { useRouter } from 'next/navigation'
import { toastSuccess } from '~/plugins/toast'
import useUserStore from '~/stores/user'
import Socket from '~/plugins/socket'

export const useUser = () => {

  const router = useRouter()
  const reset = useUserStore((state) => state.reset)

  const logout = (callback = () => { }) => {

    const instance = new Socket()

    instance.disconnect()
    reset()
    toastSuccess('Wallet Disconnected!')
    router.push('/')
    callback()
  }

  return {
    logout,
  }
}