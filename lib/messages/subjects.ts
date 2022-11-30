import { Subject } from 'rxjs'
import { SdkError } from '../helpers/error'
import { WalletRequest, WalletResponse } from '../IO/schemas'
import { IncomingMessage, MessageDispatch } from './_types'

export type SubjectsType = ReturnType<typeof Subjects>

export const Subjects = () => ({
  outgoingMessageSubject: new Subject<WalletRequest>(),
  incomingMessageSubject: new Subject<
    IncomingMessage['event'] | WalletResponse
  >(),
  responseSubject: new Subject<WalletResponse | SdkError>(),
  messageLifeCycleEventSubject: new Subject<IncomingMessage['event']>(),
  dispatchEventSubject: new Subject<MessageDispatch>(),
})
