import { WalletInteractionResponse } from '../IO/schemas'
import { MessageLifeCycleEvent } from './events/_types'

export type Metadata = { networkId: number; dAppDefinitionAddress: string }

export type IncomingMessage = {
  event: { eventType: MessageLifeCycleEvent; interactionId: string }
  response: WalletInteractionResponse
}
