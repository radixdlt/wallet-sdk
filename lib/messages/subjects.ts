import { Subject } from 'rxjs'
import { IncomingMessage, OutgoingMessage } from './_types'
import { EventType } from './events'

export type SubjectsType = ReturnType<typeof Subjects>

export const Subjects = () => ({
  outgoingMessageSubject: new Subject<OutgoingMessage>(),
  incomingMessageSubject: new Subject<IncomingMessage>(),
  responseSubject: new Subject<IncomingMessage>(),
  dispatchEventSubject: new Subject<{
    event: EventType
    payload: OutgoingMessage
  }>(),
})
