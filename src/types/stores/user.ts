import IUserTokens from '~/dtos/auth/IUserTokens'
import { UserDto } from '~/dtos/auth/UserDto'

export interface ILoginDto {
  userTokens: IUserTokens
  walletAddress: string
}

export interface IUserInitialState extends ILoginDto {
  user: UserDto
}

export interface IUserState extends IUserInitialState {
  setUserTokens: (userTokens: IUserTokens) => void
  setWalletAddress: (walletAddress: string) => void
  setUser: (user: UserDto) => void
  isAuthenticated: () => boolean
  reset: () => void
  login: (user: ILoginDto) => void
}