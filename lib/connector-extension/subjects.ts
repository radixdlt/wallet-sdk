import { Subject } from 'rxjs'
import {
  MessageLifeCycleEvent,
  WalletInteraction,
  WalletInteractionResponse,
} from '../IO/v2/schemas'

export type Subjects = ReturnType<typeof Subjects>

export const Subjects = () => ({
  outgoingMessageSubject: new Subject<WalletInteraction>(),
  incomingMessageSubject: new Subject<
    MessageLifeCycleEvent | WalletInteractionResponse
  >(),
  responseSubject: new Subject<WalletInteractionResponse>(),
  messageLifeCycleEventSubject: new Subject<MessageLifeCycleEvent>(),
})
