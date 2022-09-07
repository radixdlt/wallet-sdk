import { MethodType, WalletRequests, WalletResponses } from '../methods/_types'

export type GenericOutgoingMessage<M extends MethodType> = {
  method: M
  requestId: string
  payload: WalletRequests[M]
}

export type OutgoingMessage = {
  request: GenericOutgoingMessage<'request'>
  sendTransaction: GenericOutgoingMessage<'sendTransaction'>
}

export type OutgoingMessageType = OutgoingMessage[MethodType]

type GenericIncomingMessage<M extends MethodType> = {
  method: M
  requestId: string
  payload: WalletResponses[M]
}

export type IncomingMessage = {
  request: GenericIncomingMessage<'request'>
  sendTransaction: GenericIncomingMessage<'sendTransaction'>
}

export type IncomingMessageType = IncomingMessage[keyof IncomingMessage]
