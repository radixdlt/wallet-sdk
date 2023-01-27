import { WalletInteraction, WalletInteractionResponse } from '../IO/schemas'
import { MessageLifeCycleEvent, OutgoingMessageEvent } from './events/_types'

export type Metadata = { networkId: number; dAppDefinitionAddress: string }

export type IncomingMessage = {
  event: { eventType: MessageLifeCycleEvent; interactionId: string }
  response: WalletInteractionResponse
}

export type MessageDispatch = {
  event: OutgoingMessageEvent
  payload: WalletInteraction
}
