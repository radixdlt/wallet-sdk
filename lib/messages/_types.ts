import { Wallet } from '../_types'
import { MessageLifeCycleEvent, OutgoingMessageEvent } from './events/_types'

export type Metadata = { networkId: number; dAppId: string }

export type OutgoingMessage = {
  requestId: string
  payload: Wallet['requestItem'][]
}

export type IncomingMessage = {
  event: { eventType: MessageLifeCycleEvent; requestId: string }
  response: {
    requestId: string
    payload: Wallet['response']
  }
}

export type MessageDispatch = {
  event: OutgoingMessageEvent
  payload: OutgoingMessage
}
