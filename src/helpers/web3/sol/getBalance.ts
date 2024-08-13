
import { useWallet } from '@solana/wallet-adapter-react'
import { ed25519 } from '@noble/curves/ed25519'
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import bs58 from 'bs58'

import { getRPC } from '~/helpers/web3'
import Web3Exception from '~/exceptions/Web3Exception'
import env from '~/env'

export const getBalance = async (walletAddress: string): Promise<string> => {

  let getBalanceRetries = 0
  const endpoint = getRPC()

  const getAsync = async (walletAddress: string): Promise<string> => {

    const message = `Failed To Fetch ${walletAddress} Balance`
    const pub = new PublicKey(walletAddress)

    if (!walletAddress || !endpoint) {
      new Web3Exception(message, { walletAddress, getBalanceRetries }, { sendToast: true })
      return env.DEFAULT_WALLET_BALANCE
    }

    try {
      const connection = new Connection(endpoint)
      const solBalance = await connection.getBalance(pub, 'confirmed') / LAMPORTS_PER_SOL
      return solBalance.toString()
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