import { WalletRequest, WalletResponse } from '../IO/schemas'
import { MessageLifeCycleEvent, OutgoingMessageEvent } from './events/_types'

export type Metadata = { networkId: number; dAppId: string }

export type IncomingMessage = {
  event: { eventType: MessageLifeCycleEvent; requestId: string }
  response: WalletResponse
}

export type MessageDispatch = {
  event: OutgoingMessageEvent
  payload: WalletRequest
}
