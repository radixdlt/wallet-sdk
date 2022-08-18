import {
  MethodType,
  Request,
  RequestWalletResponse,
  Transaction,
  TransactionWalletResponse,
} from '../methods'

export type Message<M extends MethodType, P> = {
  method: M
  requestId: string
  payload: P
}

export type OutgoingMessage =
  | Message<'request', Request>
  | Message<'transaction', Transaction>

export type IncomingMessage =
  | Message<'request', RequestWalletResponse>
  | Message<'transaction', TransactionWalletResponse>
