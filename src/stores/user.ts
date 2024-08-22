import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware' // Import StateStorage
import { UserDto } from '~/dtos/auth/UserDto'
import { toastSuccess } from '~/plugins/toast'
import { ILoginDto, IUserInitialState, IUserState } from '~/types/stores/user'
import IUserTokens from '~/dtos/auth/IUserTokens'
import { cookieStorage } from './storages'

// Define your initial state
const initialState: IUserInitialState = {
  userTokens: {
    accessToken: '',
    refreshToken: '',
  },
  user: {
    id: '',
  },
  walletAddress: '',
}

export const USER_CACHE_KEY = 'app-user'

// Create your Zustand store
const useUserStore = create<IUserState>()(
  persist(
    // Use your custom storage adapter here
    (set, get) => ({
      ...initialState,
      setUserTokens: (userTokens: IUserTokens) => set({ userTokens: userTokens }),
      setUser: (user: UserDto) => set({ user }),
      setWalletAddress: (walletAddress: string) => set({ walletAddress }),
      reset: () => {
        cookieStorage.removeItem(USER_CACHE_KEY)
        set(initialState)
      },
      isAuthenticated: () => {

        const { userTokens } = get()
        return userTokens && userTokens.accessToken.length > 0

      },
      login: (user: ILoginDto) => {

        const { setUserTokens, setWalletAddress } = get()

        setUserTokens(user.userTokens)
        setWalletAddress(user.walletAddress)
        toastSuccess('Welcome!')

      },
    }),
    {
      // Pass the custom storage adapter to the middleware
      name: USER_CACHE_KEY,
      storage: createJSONStorage(() => cookieStorage),
    },
  ),
)

export default useUserStore
