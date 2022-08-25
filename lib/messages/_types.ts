import { SdkError } from '../errors'
import {
  MethodType,
  Request,
  RequestWalletResponse,
  SendTransaction,
  TransactionWalletResponse,
} from '../methods'

export type Message<M extends MethodType, P> = {
  method: M
  requestId: string
  payload: P
}

export type OutgoingMessage =
  | Message<'request', Request>
  | Message<'sendTransaction', SendTransaction>

export type SuccessResponse =
  | Message<'request', RequestWalletResponse>
  | Message<'sendTransaction', TransactionWalletResponse>

export type IncomingMessage = SuccessResponse | SdkError
