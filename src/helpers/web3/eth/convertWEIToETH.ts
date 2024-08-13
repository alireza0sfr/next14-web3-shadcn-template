import { ethers } from "ethers"

export const convertWEIToETH = (wei: string) => ethers.utils.formatEther(wei).toString()