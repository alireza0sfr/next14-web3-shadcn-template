import { IExceptionOptions, TExceptionDetails } from '~/types/exceptions/exception'
import BaseException from './BaseException'

export default class ApiException extends BaseException {
  constructor(msg: string, details: TExceptionDetails = {}, options?: IExceptionOptions) {
    super(msg, details, { name: 'ApiException', sentryLogLevel: 'fatal', ...options })
  }
}