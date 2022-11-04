import { Subject } from 'rxjs'
import { SdkError } from '../helpers/error'
import {
  IncomingMessage,
  MessageDispatch,
  Metadata,
  OutgoingMessage,
} from './_types'

export type SubjectsType = ReturnType<typeof Subjects>

export const Subjects = () => ({
  outgoingMessageSubject: new Subject<
    OutgoingMessage & { metadata: Metadata }
  >(),
  incomingMessageSubject: new Subject<
    IncomingMessage['event'] | IncomingMessage['response']
  >(),
  responseSubject: new Subject<IncomingMessage['response'] | SdkError>(),
  messageLifeCycleEventSubject: new Subject<IncomingMessage['event']>(),
  dispatchEventSubject: new Subject<MessageDispatch>(),
})
