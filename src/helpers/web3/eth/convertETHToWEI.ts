import { ethers } from "ethers"

export const convertETHToWEI = (eth: string) => ethers.utils.parseEther(eth).toString()