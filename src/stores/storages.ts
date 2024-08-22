import { StateStorage } from 'zustand/middleware' // Import StateStorage

// Helper function to get and set cookies
const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2)
    return parts.pop()?.split(";").shift()
}
const setCookie = (name: string, value: string, days?: number): void => {
  let expires = ""
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = `; expires=${date.toUTCString()}`
  }
  document.cookie = `${name}=${value || ""}${expires}; path=/`
}
// Custom storage adapter for cookies
export const cookieStorage: StateStorage = {
  getItem: (name: string): string | null => {
    return getCookie(name) || null
  },
  setItem: (name: string, value: string): void => {
    setCookie(name, value, 7) // Expires in 7 days
  },
  removeItem: (name: string): void => {
    document.cookie = `${name}=; Max-Age=-99999999;`
  },
}