import env from '~/env'
import Web3Exception from '~/exceptions/Web3Exception'
import { createBigNumber } from '~/helpers/math'
import { getETHPriceInUSD } from '~/helpers/web3/eth/getETHPriceInUSD'

export const convertUSDtoETH = async (amountUSD: string, ethPriceInUSD?: string) => {

  if (amountUSD === '0')
    return '0'

  try {

    let ethPrice = ethPriceInUSD

    if (!ethPrice)
      ethPrice = await getETHPriceInUSD()

    if (ethPrice === '0')
      throw new Web3Exception('Unable To Fetch ETH Price', { amountUSD }, { sentryLogLevel: 'warning' })

    return createBigNumber(amountUSD).div(createBigNumber(ethPrice)).toString()
  } catch (error) {

    if (!(error instanceof Web3Exception))
      new Web3Exception('Failed To Convert USD to ETH', { amountUSD, error })

    return env.DEFAULT_WALLET_BALANCE
  }
}