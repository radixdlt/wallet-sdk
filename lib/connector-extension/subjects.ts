import { Subject } from 'rxjs'
import {
  ExtensionInteraction,
  MessageLifeCycleEvent,
  MessageLifeCycleExtensionStatusEvent,
  WalletInteraction,
  WalletInteractionResponse,
} from '@radixdlt/radix-connect-schemas'

export type Subjects = ReturnType<typeof Subjects>

export const Subjects = () => ({
  outgoingMessageSubject: new Subject<
    WalletInteraction | ExtensionInteraction
  >(),
  incomingMessageSubject: new Subject<
    | MessageLifeCycleEvent
    | MessageLifeCycleExtensionStatusEvent
    | WalletInteractionResponse
  >(),
  responseSubject: new Subject<WalletInteractionResponse>(),
  messageLifeCycleEventSubject: new Subject<MessageLifeCycleEvent>(),
})
