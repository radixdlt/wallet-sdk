import { err, ok, Result } from 'neverthrow'
import { filter, map, Observable } from 'rxjs'
import { OutgoingMessage, SubjectsType, SuccessResponse } from '.'
import { SdkError } from '../errors'

export const send = <ResponseType extends SuccessResponse>(
  subjects: SubjectsType,
  message: OutgoingMessage
): Observable<Result<ResponseType['payload'], SdkError>> => {
  subjects.outgoingMessageSubject.next(message)

  return subjects.responseSubject.pipe(
    filter((response) => response.requestId === message.requestId),
    map((message) => ('method' in message ? ok(message.payload) : err(message)))
  )
}
