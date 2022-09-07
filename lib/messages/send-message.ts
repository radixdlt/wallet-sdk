import { err, ok, Result } from 'neverthrow'
import { filter, map, Observable } from 'rxjs'
import { OutgoingMessageType, SubjectsType, IncomingMessage } from '.'
import { SdkError } from '../errors'
import { MethodType } from '../methods/_types'

export const sendMessage = <M extends MethodType>(
  subjects: SubjectsType,
  message: OutgoingMessageType
): Observable<Result<IncomingMessage[M]['payload'], SdkError>> => {
  subjects.outgoingMessageSubject.next(message)

  return subjects.responseSubject.pipe(
    filter((response) => response.requestId === message.requestId),
    map((message) => ('method' in message ? ok(message.payload) : err(message)))
  )
}
