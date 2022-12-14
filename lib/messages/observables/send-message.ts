import log from 'loglevel'
import { Err, err, ok, Result, ResultAsync } from 'neverthrow'
import {
  filter,
  first,
  map,
  merge,
  Observable,
  of,
  share,
  Subject,
  takeUntil,
  tap,
  timer,
} from 'rxjs'
import { config } from '../../config'
import { createSdkError, errorType, SdkError } from '../../helpers/error'
import { unwrapObservable } from '../../helpers/unwrap-observable'
import { WalletRequest, WalletSuccessResponse } from '../../IO/schemas'
import { CallbackFns } from '../events/_types'
import { SubjectsType } from '../subjects'
import { messageEvents } from './message-events'

export type SendMessage = ReturnType<typeof sendMessage>

export const sendMessage =
  (subjects: SubjectsType) =>
  (callbackFns: Partial<CallbackFns>) =>
  (message: WalletRequest): ResultAsync<WalletSuccessResponse, SdkError> => {
    const cancelRequestSubject = new Subject<void>()

    if (callbackFns.requestControl)
      callbackFns.requestControl({
        cancelRequest: () => {
          log.debug(
            `🔵⬆️❌ wallet request canceled\n${JSON.stringify(
              message,
              null,
              2
            )}`
          )
          return cancelRequestSubject.next()
        },
      })

    const cancelRequest$ = cancelRequestSubject
      .asObservable()
      .pipe(
        map(() =>
          err(createSdkError(errorType.canceledByUser, message.requestId))
        )
      )

    const response$ = subjects.responseSubject.pipe(
      filter((response) => response.requestId === message.requestId),
      map(
        (message): Result<WalletSuccessResponse, SdkError> =>
          'items' in message ? ok(message) : err(message)
      )
    )

    const walletResponseOrCancelRequestError$ = merge(
      response$,
      cancelRequest$
    ).pipe(first())

    const messageEvent$ = messageEvents(subjects, message.requestId).pipe(
      tap((event) => {
        if (callbackFns.eventCallback)
          callbackFns.eventCallback(event.eventType)
      }),
      takeUntil(response$),
      share()
    )

    const messageEventSubscription = messageEvent$.subscribe()

    const missingExtensionError$ = timer(config.extensionDetectionTime).pipe(
      map(() =>
        err(createSdkError(errorType.missingExtension, message.requestId))
      )
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
        subjects.outgoingMessageSubject.next(message)
      }),
      filter(() => false)
    ) as Observable<never>

    const walletResponse$ = merge(
      walletResponseOrCancelRequestError$,
      extensionDetection$,
      sendMessage$
    ).pipe(
      tap(() => {
        messageEventSubscription.unsubscribe()
      })
    )

    return unwrapObservable(walletResponse$)
  }
