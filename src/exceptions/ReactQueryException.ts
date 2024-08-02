import { IExceptionOptions, TExceptionDetails } from '~/types/exceptions/exception'
import BaseException from './BaseException'

export default class ReactQueryException extends BaseException {
  constructor(msg: string, details: TExceptionDetails = {}, options?: IExceptionOptions) {
    super(msg, details, { name: 'ReactQueryException', sentryLogLevel: 'fatal', ...options })
  }
}