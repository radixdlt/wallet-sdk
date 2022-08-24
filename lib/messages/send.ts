import { ok, Result } from 'neverthrow'
import { filter, map, Observable } from 'rxjs'
import { IncomingMessage, Message, OutgoingMessage, SubjectsType } from '.'
import { RequestWalletResponse, SdkError } from '../methods'

export const send = <ResponseType extends IncomingMessage>(
  subjects: SubjectsType,
  message: OutgoingMessage
): Observable<Result<ResponseType['payload'], SdkError>> => {
  subjects.outgoingMessageSubject.next(message)

  return subjects.responseSubject.pipe(
    filter((response) => response.requestId === message.requestId),
    map((message) => ok(message.payload))
  )
}

export const sendRequest = (subjects: SubjectsType, message: OutgoingMessage) =>
  send<Message<'request', RequestWalletResponse>>(subjects, message)
