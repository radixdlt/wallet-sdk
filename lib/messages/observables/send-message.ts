import { Err, err, ok, ResultAsync } from 'neverthrow'
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
import { config } from '../../config'
import { createSdkError, SdkError } from '../../helpers/error'
import { unwrapObservable } from '../../helpers/unwrap-observable'
import { Wallet } from '../../_types'
import { MessageLifeCycleEvent } from '../events/_types'
import { SubjectsType } from '../subjects'
import { Metadata, OutgoingMessage } from '../_types'
import { messageEvents } from './message-events'

export type SendMessage = ReturnType<typeof sendMessage>

export const sendMessage =
  (metadata: Metadata, subjects: SubjectsType) =>
  (eventCallback?: (eventType: MessageLifeCycleEvent) => void) =>
  (message: OutgoingMessage): ResultAsync<Wallet['response'], SdkError> => {
    const response$ = subjects.responseSubject.pipe(
      filter((response) => response.requestId === message.requestId),
      map((message) =>
        'payload' in message ? ok(message.payload) : err(message)
      ),
      first()
    )

    const messageEvent$ = messageEvents(subjects, message.requestId).pipe(
      tap((event) => {
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
      filter((value): value is Err<never, SdkError> => !('eventType' in value))
    )

    const sendMessage$ = of(true).pipe(
      tap(() => {
        subjects.outgoingMessageSubject.next({
          ...message,
          metadata,
        })
      }),
      filter(() => false)
    ) as Observable<never>

    const walletResponse$ = merge(
      response$,
      extensionDetection$,
      sendMessage$
    ).pipe(
      tap(() => {
        messageEventSubscription.unsubscribe()
      })
    )

    return unwrapObservable(walletResponse$)
  }
