import { Subject } from 'rxjs'
import {
  IncomingMessage,
  IncomingMessageType,
  MessageDispatch,
  Metadata,
  OutgoingMessageType,
} from './_types'
import { SdkError } from '../errors'

export type SubjectsType = ReturnType<typeof Subjects>

export const Subjects = () => ({
  outgoingMessageSubject: new Subject<
    OutgoingMessageType & { metadata: Metadata }
  >(),
  incomingMessageSubject: new Subject<IncomingMessageType>(),
  responseSubject: new Subject<
    IncomingMessage['request'] | IncomingMessage['sendTransaction'] | SdkError
  >(),
  messageLifeCycleEventSubject: new Subject<
    IncomingMessage['messageLifeCycleEvent']
  >(),
  dispatchEventSubject: new Subject<MessageDispatch>(),
})
