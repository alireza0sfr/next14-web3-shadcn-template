import { IExceptionOptions, TExceptionDetails } from '~/types/exceptions/exception'
import BaseException from './BaseException'

export default class ValidationException extends BaseException {
  constructor(msg: string, details: TExceptionDetails = {}, options?: IExceptionOptions) {
    super(msg, details, { name: 'ValidationException', sentryLogLevel: 'info', sendToast: true, ...options })
  }
}