import { SdkError } from '../errors'
import { Request, SendTransaction } from '../methods'
import { MethodType, WalletResponses } from '../methods/_types'

export type Message<M extends MethodType, P> = {
  method: M
  requestId: string
  payload: P
}

export type GenericIncomingMessage<M extends MethodType> = {
  method: M
  requestId: string
  payload: WalletResponses[M]
}

export type OutgoingMessage =
  | Message<'request', Request>
  | Message<'sendTransaction', SendTransaction>

export type SuccessResponse =
  | GenericIncomingMessage<'request'>
  | GenericIncomingMessage<'sendTransaction'>

export type IncomingMessage = SuccessResponse | SdkError
