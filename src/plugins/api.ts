import axios, { AxiosInstance } from "axios"

import useUserStore from "~/stores/user"
import IUserTokens from '~/dtos/auth/IUserTokens'

import eventEmitter from '~/helpers/eventEmitter'
import Endpoint from './endpoint'
import ValidationException from '~/exceptions/ValidationException'
import ApiException from '~/exceptions/ValidationException'
import ImplementationException from '~/exceptions/ImplementationException'

export type TRole = "ADMIN" | "USER"

const refreshUsersToken = async (role: TRole, axiosInstance: AxiosInstance, err: any) => {
  const endpoint = Endpoint.getUrl(`${role.toLocaleLowerCase()}-refresh`)
  const refreshToken = getRefreshToken(role)

  const originalRequest = err.config

  try {
    const res = await axios.post<IUserTokens>(endpoint, {}, { headers: { Authorization: `Bearer ${refreshToken}` } })

    if (role === 'USER') {
      const store = useUserStore.getState()
      store.setUserTokens(res.data)
    }
    else {
      throw new ImplementationException('[API] adminStore Not Implmented')
      // const store = useAdminStore.getState()
      // store.setAdminTokens(res.data)
    }

    axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + res.data.accessToken
    return axiosInstance(originalRequest)

  } catch (e: any) {
    if (e && e?.response && (e?.response?.status === 401 || e?.response?.status === 403)) {
      eventEmitter.emit("unauthorized", role)

      const message = 'Your Session Has Expired!'
      new ApiException(message, { error: e, role }, { sentryLogLevel: 'info', sendToast: true })
      return Promise.reject(message)
    }
    else {
      const message = 'Unable To Refresh Token'
      new ApiException(message, { error: e, role }, { sentryLogLevel: 'error' })
      return Promise.reject(message)
    }
  }
}

const getRefreshToken = (role: TRole) => {

  if (role === 'ADMIN') {
    throw new ImplementationException('[API] adminStore Not Implmented')
    // const adminStore = useAdminStore.getState()
    // return adminStore?.adminTokens && adminStore?.adminTokens?.refreshToken ? adminStore?.adminTokens?.refreshToken : ''
  }

  const userStore = useUserStore.getState()
  return userStore.userTokens && userStore.userTokens.refreshToken ? userStore.userTokens.refreshToken : ""

}

const getAccessToken = (role: TRole) => {

  if (role === 'ADMIN') {
    throw new ImplementationException('[API] adminStore Not Implmented')
    // const adminStore = useAdminStore.getState()
    // return adminStore?.adminTokens && adminStore?.adminTokens?.accessToken ? adminStore?.adminTokens?.accessToken : ''
  }

  const userStore = useUserStore.getState()
  return userStore.userTokens && userStore.userTokens.accessToken ? userStore.userTokens.accessToken : ""

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

      if (err?.response?.status === 401 && !originalRequest._retry) {

        if (token)
          return await refreshUsersToken(role, axiosInstance, err)
        else {
          eventEmitter.emit("unauthorized", role)
          const message = 'Your Session Has Expired!'
          new ApiException(message, { error: err, role, token }, { sentryLogLevel: 'info', sendToast: true })
          return Promise.reject(message)
        }

      } else {

        const message = err?.response?.data?.message || err.message

        if (err?.response.status == 400)
          new ValidationException(message, { err, role }, { sendToast: true })
        else
          new ApiException(message, { err, role }, { sendToast: true })

        return Promise.reject(message)
      }
    }
  )

  return axiosInstance
}
