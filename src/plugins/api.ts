import axios, { AxiosInstance } from "axios"

// import useUserStore from "~/stores/user"
// import { IUserTokens } from "~/types/user"
import { toastError } from "../plugins/toast"

import eventEmitter from '~/helpers/eventEmitter'
import Endpoint from './endpoint'
import ApiException from '~/exceptions/ApiException'
import ValidationException from '~/exceptions/ValidationException'
import ImplementationException from '~/exceptions/ImplementationException'

export type TRole = "ADMIN" | "USER"

const refreshUsersToken = async (role: TRole, axiosInstance: AxiosInstance, err: any) => {
  throw new ImplementationException('[API] refreshUsersToken Not Implmented')

  // const endpoint = Endpoint.getUrl(`${role.toLocaleLowerCase()}-refresh`)
  // const refreshToken = getRefreshToken(role)
  // const userStore = useUserStore.getState()

  // const originalRequest = err.config

  // try {
  //   const res = await axios.post<IUserTokens>(endpoint, {}, { headers: { Authorization: `Bearer ${refreshToken}` } })

  //   userStore.setUserTokens(res.data)
  //   axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + res.data.accessToken
  //   return axiosInstance(originalRequest)

  // } catch (e: any) {
  //   if (e && e?.response && (e?.response?.status === 401 || e?.response?.status === 403)) {
  //     eventEmitter.emit("unauthorized", role)

  //     const message = 'Your Session Has Expired!'
  //     new ApiException(message, { error: e, role }, { sentryLogLevel: 'info', sendToast: true })
  //     return Promise.reject(message)
  //   }
  //   else {
  //     const message = 'Unable To Refresh Token'
  //     new ApiException(message, { error: e, role }, { sentryLogLevel: 'error' })
  //     return Promise.reject(message)
  //   }
  // }
}

const getRefreshToken = (role: TRole): string => {
  throw new ImplementationException('[API] getRefreshToken Not Implmented')
}

const getAccessToken = (role: TRole): string => {
  throw new ImplementationException('[API] getAccessToken Not Implmented')
}

export function useAxios(role: TRole = "USER") {
  const axiosInstance = axios.create()

  axiosInstance.interceptors.request.use((config) => {

    const token = getAccessToken(role)

    if (token?.length)
      config.headers["Authorization"] = `Bearer ${token}`
    else
      delete config.headers["Authorization"]

    return config
  })

  axiosInstance.interceptors.response.use(
    (res) => { return res },
    async (err) => {

      const originalRequest = err.config
      const token = getRefreshToken(role)

      if (err?.response?.status === 401 && token && !originalRequest._retry) {

        return await refreshUsersToken(role, axiosInstance, err)

      } else if (err?.response?.data?.message) {
        const errors = err?.response?.data?.message

        let message = ""

        if (typeof errors === "string")
          message = errors
        else
          message = errors.join("\n")

        if (err?.response.status >= 500)
          new ApiException(message, { err, role }, { sendToast: true })
        else
          new ValidationException(message, { err, role }, { sendToast: true })

        return Promise.reject(errors)
      } else {
        new ApiException(err.message, { err, role }, { sendToast: true })
        return Promise.reject(err)
      }
    }
  )

  return axiosInstance
}
