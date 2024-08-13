import { StateStorage } from 'zustand/middleware' // Import StateStorage

export const cookieStorage: StateStorage = {
  getItem: (name) => {
    // Implement your own cookie retrieval logic here
    return document.cookie
      .split('; ')
      .find((row) => row.startsWith(name))
      ?.split('=')[1] || ''
  },
  setItem: (name, value) => {
    // Implement your own cookie storage logic here
    document.cookie = `${name}=${value}`
  },
  removeItem: (name) => {
    // Implement your own logic to remove a cookie
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  }
}