import { Subject } from 'rxjs'
import { SdkError } from '../helpers/error'
import {
  WalletInteraction,
  WalletInteractionResponse,
  WalletInteractionSuccessResponse,
} from '../IO/schemas'
import { IncomingMessage, MessageDispatch } from './_types'

export type Subjects = ReturnType<typeof Subjects>

export const Subjects = () => ({
  outgoingMessageSubject: new Subject<WalletInteraction>(),
  incomingMessageSubject: new Subject<
    IncomingMessage['event'] | WalletInteractionResponse
  >(),
  responseSubject: new Subject<WalletInteractionSuccessResponse | SdkError>(),
  messageLifeCycleEventSubject: new Subject<IncomingMessage['event']>(),
  dispatchEventSubject: new Subject<MessageDispatch>(),
})
