
import { useWallet } from '@solana/wallet-adapter-react'
import { ed25519 } from '@noble/curves/ed25519'
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import bs58 from 'bs58'

import Web3Exception from '~/exceptions/Web3Exception'

export const useWeb3 = () => {

  const { publicKey, signMessage } = useWallet()

  const GREETING = 'Greeting'

  const handleSignMessage = async () => {

    try {

      if (!publicKey) {
        new Web3Exception('Wallet not connected!', { handler: 'handleSignMessage' }, { sendToast: true })
        return
      }

      if (!signMessage) {
        new Web3Exception('Wallet does not support message signing!', { handler: 'handleSignMessage', publicKey: publicKey.toBase58() }, { sendToast: true })
        return
      }

      const normalizedMess = GREETING.replace(/\r?\n/g, '\n')
      const encodedMessage = new TextEncoder().encode(normalizedMess)
      const signature = await signMessage(encodedMessage)

      if (!ed25519.verify(signature, encodedMessage, publicKey.toBytes())) {
        new Web3Exception('Message signature invalid!', { signature, encodedMessage, publicKey: publicKey.toBase58() }, { sendToast: true })
        return
      }

      return bs58.encode(signature)
    } catch (error: any) {
      new Web3Exception(`Sign Message failed: ${error?.message}`, { error, publicKey: publicKey?.toBase58() }, { sendToast: true, sentryLogLevel: 'info' })
      return Promise.reject('Sign Message Failed')
    }
  }

  return {
    signMessage: handleSignMessage,
  }
}