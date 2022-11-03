import loglevel from 'loglevel'
import { Err, err, ok, Result } from 'neverthrow'
import {
  filter,
  first,
  map,
  merge,
  Observable,
  of,
  share,
  takeUntil,
  tap,
  timer,
} from 'rxjs'
import { OutgoingMessageType, SubjectsType, IncomingMessage } from '..'
import { config } from '../../config'
import { createSdkError, SdkError } from '../../errors'
import { MethodType } from '../../methods/_types'
import { MessageLifeCycleEvent } from '../events/_types'
import { messageEvents } from './message-events'

export type SendMessage = ReturnType<typeof sendMessage>

export const sendMessage =
  (
    { networkId, dAppId }: { networkId: number; dAppId: string },
    subjects: SubjectsType
  ) =>
  <M extends MethodType>(
    message: OutgoingMessageType,
    eventCallback?: (eventType: MessageLifeCycleEvent) => void
  ): Observable<Result<IncomingMessage[M]['payload'], SdkError>> => {
    const response$ = subjects.responseSubject.pipe(
      filter((response) => response.requestId === message.requestId),
      map((message) =>
        'method' in message ? ok(message.payload) : err(message)
      ),
      first()
    )

    const messageEvent$ = messageEvents(subjects, message.requestId).pipe(
      tap((event) => {
        loglevel.debug(
          `💬📣⬇️ received message lifecycle event\n${JSON.stringify(event)}`
        )
        if (eventCallback) eventCallback(event.eventType)
      }),
      takeUntil(response$),
      share()
    )

    const messageEventSubscription = messageEvent$.subscribe()

    const missingExtensionError$ = timer(config.extensionDetectionTime).pipe(
      map(() => err(createSdkError('missingExtension', message.requestId)))
    )

    const extensionDetection$ = merge(
      missingExtensionError$,
      messageEvent$
    ).pipe(
      first(),
      filter((value): value is Err<never, SdkError> =>
        'eventType' in value ? false : true
      )
    )

    const sendMessage$ = of(true).pipe(
      tap(() => {
        subjects.outgoingMessageSubject.next({
          ...message,
          metadata: { networkId, dAppId },
        })
      }),
      filter(() => false)
    ) as Observable<never>

    return merge(response$, extensionDetection$, sendMessage$).pipe(
      tap(() => {
        messageEventSubscription.unsubscribe()
      })
    )
  }
