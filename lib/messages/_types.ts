import { MethodType, WalletRequests, WalletResponses } from '../methods/_types'
import { MessageLifeCycleEvent, OutgoingMessageEvent } from './events/_types'

type GenericOutgoingMessage<M extends MethodType> = {
  method: M
  requestId: string
  payload: WalletRequests[M]
}

export type OutgoingMessage = {
  request: GenericOutgoingMessage<'request'>
  sendTransaction: GenericOutgoingMessage<'sendTransaction'>
}

export type OutgoingMessageType = OutgoingMessage[MethodType]

export type Metadata = { networkId: number; dAppId: string }

type GenericIncomingMessage<M extends MethodType> = {
  method: M
  requestId: string
  payload: WalletResponses[M]
}

export type IncomingMessage = {
  request: GenericIncomingMessage<'request'>
  sendTransaction: GenericIncomingMessage<'sendTransaction'>
  messageLifeCycleEvent: { eventType: MessageLifeCycleEvent; requestId: string }
}

export type IncomingMessageType = IncomingMessage[keyof IncomingMessage]

export type MessageDispatch = {
  event: OutgoingMessageEvent
  payload: OutgoingMessageType
}
