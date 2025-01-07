import { ToastOptions } from "react-hot-toast";

import {
  IExceptionOptions,
  TExceptionDetails,
} from "~/types/exceptions/exception";
import BaseException from "./BaseException";

export default class Web3Exception extends BaseException {
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
        name: "Web3Exception",
        sentryLogLevel: "fatal",
        ...options,
      },
      toastOptions
    );
  }
}
