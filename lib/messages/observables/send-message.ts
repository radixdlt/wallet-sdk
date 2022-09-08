import loglevel from 'loglevel'
import { err, ok, Result } from 'neverthrow'
import { filter, first, map, Observable, takeUntil, tap } from 'rxjs'
import { OutgoingMessageType, SubjectsType, IncomingMessage } from '..'
import { SdkError } from '../../errors'
import { MethodType } from '../../methods/_types'
import { MessageLifeCycleEvent } from '../events/_types'
import { messageEvents } from './message-events'

export const sendMessage = <M extends MethodType>(
  subjects: SubjectsType,
  message: OutgoingMessageType,
  eventCallback?: (eventType: MessageLifeCycleEvent) => void
): Observable<Result<IncomingMessage[M]['payload'], SdkError>> => {
  subjects.outgoingMessageSubject.next(message)

  const response$ = subjects.responseSubject.pipe(
    filter((response) => response.requestId === message.requestId),
    map((message) =>
      'method' in message ? ok(message.payload) : err(message)
    ),
    first()
  )

  const messageEventSubscription = messageEvents(subjects, message.requestId)
    .pipe(
      tap((event) => {
        loglevel.debug(
          `💬📣⬇️ received message lifecycle event\n${JSON.stringify(event)}`
        )
        if (eventCallback) eventCallback(event.eventType)
      }),
      takeUntil(response$)
    )
    .subscribe()

  return response$.pipe(
    tap(() => {
      messageEventSubscription.unsubscribe()
    })
  )
}
