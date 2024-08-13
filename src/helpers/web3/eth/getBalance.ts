import { ethers } from "ethers"
import env from '~/env'
import Web3Exception from '~/exceptions/Web3Exception'
import { getRPC } from '~/helpers/web3'

export const getBalance = async (walletAddress: string): Promise<string> => {
  let getBalanceRetries = 0
  const endpoint = getRPC()

  const getAsync = async (walletAddress: string): Promise<string> => {
    const message = `Failed To Fetch ${walletAddress} Balance`

    if (!walletAddress || !endpoint) {
      new Web3Exception(message, { walletAddress, getBalanceRetries }, { sendToast: true })
      return env.DEFAULT_WALLET_BALANCE
    }

    try {
      const provider = new ethers.providers.JsonRpcProvider(endpoint)
      const balance = ethers.utils.formatEther(await provider.getBalance(walletAddress))
      return balance === '0.0' ? '0' : balance
    } catch (error) {

      if (getBalanceRetries >= 5) {
        new Web3Exception(message, { walletAddress, endpoint, getBalanceRetries }, { sendToast: true })
        return env.DEFAULT_WALLET_BALANCE
      }

      getBalanceRetries += 1
      return getAsync(walletAddress)
    }
  }

  return await getAsync(walletAddress)

}