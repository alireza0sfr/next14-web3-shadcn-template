import { ToastOptions } from "react-hot-toast";

import {
  IExceptionOptions,
  TExceptionDetails,
} from "~/types/exceptions/exception";
import BaseException from "./BaseException";

export default class ApiException extends BaseException {
  constructor(
    msg: string,
    details: TExceptionDetails = {},
    options?: IExceptionOptions,
    toastOptions?: ToastOptions
  ) {
    super(
      msg,
      details,
      {
        name: "ApiException",
        sentryLogLevel: "fatal",
        ...options,
      },
      toastOptions
    );
  }
}
