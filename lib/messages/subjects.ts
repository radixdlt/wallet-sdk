import { Subject } from 'rxjs'
import { IncomingMessageType, OutgoingMessageType } from './_types'
import { EventType } from './events'
import { SdkError } from '../errors'

export type SubjectsType = ReturnType<typeof Subjects>

export const Subjects = () => ({
  outgoingMessageSubject: new Subject<OutgoingMessageType>(),
  incomingMessageSubject: new Subject<IncomingMessageType>(),
  responseSubject: new Subject<IncomingMessageType | SdkError>(),
  dispatchEventSubject: new Subject<{
    event: EventType
    payload: OutgoingMessageType
  }>(),
})
