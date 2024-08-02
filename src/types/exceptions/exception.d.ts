import { SeverityLevel } from "@sentry/nextjs"

export interface IExceptionOptions {
  readonly name?: string
  readonly sentryLogLevel?: SeverityLevel
  readonly sendToast?: boolean
  readonly sendToSentry?: boolean
}

export type TExceptionDetails = Record<string, unknown>