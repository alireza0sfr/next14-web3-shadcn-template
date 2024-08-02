import * as Sentry from "@sentry/nextjs"
import { toastError } from '~/plugins/toast'
import { IExceptionOptions, TExceptionDetails } from '~/types/exceptions/exception'

export default class BaseException extends Error {

  readonly name: string
  readonly sentryLogLevel: Sentry.SeverityLevel
  readonly sendToast: boolean
  readonly sendToSentry: boolean
  readonly details: TExceptionDetails

  constructor(msg: string, details: TExceptionDetails = {}, options?: IExceptionOptions) {
    super(msg)

    Object.setPrototypeOf(this, BaseException.prototype)

    this.name = options?.name || 'BaseException'
    this.sentryLogLevel = options?.sentryLogLevel || 'error'
    this.sendToSentry = options?.sendToSentry || true
    this.sendToast = options?.sendToast || false
    const stackLines = this.addStackTrace()
    this.details = { ...details, stackLines, issuedAt: new Date().toISOString(), }

    if (this.sendToSentry)
      this.handleSendToSentry()

    if (this.sendToast)
      toastError(msg, {}, false)
  }

  private handleSendToSentry() {
    Sentry.withScope((scope) => {
      scope.setLevel(this.sentryLogLevel)
      scope.setExtras(this.details)
      Sentry.captureException(this)
    })
  }

  private addStackTrace(): string[] {

    // Extract file name and line number from the original stack trace
    const originalStack = new Error().stack || ''
    const stackLines = originalStack.split('\n')
    const relevantStackLine = stackLines[4] || '' // Adjust the index as needed to get the correct line

    this.stack = `${this.name}: ${this.message}\n    at ${relevantStackLine.trim()}`
    return stackLines
  }
}