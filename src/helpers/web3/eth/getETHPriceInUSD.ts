import { ethers } from "ethers"

import Web3Exception from '~/exceptions/Web3Exception'
import { getRPC } from '~/helpers/web3'

export const getETHPriceInUSD = async () => {
  let getPriceRetries = 0

  const getAsync = async (): Promise<string> => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(getRPC())
      const priceFeedABI = ["function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)",]
      const priceFeedAddress = "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70"

      const priceFeedContract = new ethers.Contract(priceFeedAddress, priceFeedABI, provider)
      const data = await priceFeedContract.latestRoundData()
      return ethers.utils.formatUnits(data.answer, 8)

    } catch (error) {

      if (getPriceRetries >= 5) {
        new Web3Exception('Failed To Get ETH Price', { getPriceRetries, error }, { sendToast: true })
        return '0'
      }

      getPriceRetries += 1
      return await getAsync()
    }
  }

  return await getAsync()
}