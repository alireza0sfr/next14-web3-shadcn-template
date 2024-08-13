import { toastSuccess } from '~/plugins/toast'
import { clsx, ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const copyToClipBoard = (text: string, onCopy = (text: string) => { }) => {
  var textField = document.createElement('textarea')
  textField.innerText = text
  document.body.appendChild(textField)
  textField.select()
  document.execCommand('copy')
  textField.remove()
  toastSuccess('Copied to clipboard')
  onCopy(text)
}

export const truncateAmount = (amount: string | undefined, decimalCount: number = 4, formatWithCommas: boolean = true): string => {

  if (!amount)
    return '-'

  if (amount === '0.0')
    return '0'

  if (amount === '0')
    return amount

  const [number, decimals] = amount.split('.')

  const formattedNumber = formatWithCommas ? number.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : number

  if (!decimals || decimals.length <= decimalCount) {
    return decimals ? `${formattedNumber}.${decimals}` : formattedNumber
  }

  return `${formattedNumber}.${decimals.substring(0, decimalCount)}`
}

export const openExternalUrl = (url: string) => {

  if (!url)
    return

  const a = document.createElement('a')
  a.href = url
  a.target = '_blank'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export const getQueryParamFromURL = (param: string) => {

  if (!window)
    return ''

  var rx = new RegExp("[?&]" + param + "=([^&]+).*$")
  var returnVal = window.location.search.match(rx)
  return returnVal === null ? "" : decodeURIComponent(returnVal[1].replace(/\+/g, " "))
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const partializeWalletAddress = (walletAddress: string): string => {

  if (!walletAddress)
    return ''

  return `${walletAddress.toString().substring(0, 6)}...${walletAddress.toString().substring(walletAddress.toString().length - 4)}`
}