import { getEnvSafely } from './config'

const VERCEL_ENVIRONMENT = getEnvSafely(process.env.NEXT_PUBLIC_VERCEL_ENVIRONMENT, 'NEXT_PUBLIC_VERCEL_ENVIRONMENT')
const API_URL = getEnvSafely(process.env.NEXT_PUBLIC_API_URL, 'NEXT_PUBLIC_API_URL')
const SENTRY_DSN = getEnvSafely(process.env.NEXT_PUBLIC_SENTRY_DSN, 'NEXT_PUBLIC_SENTRY_DSN')

const env = {
  VERCEL_ENVIRONMENT,
  API_URL,
  SENTRY_DSN,
}

export default env
