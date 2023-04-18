import { Err, err, ok, Result, ResultAsync } from 'neverthrow'
import {
  filter,
  first,
  firstValueFrom,
  map,
  merge,
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
import {
  WalletInteraction,
  WalletInteractionSuccessResponse,
} from '../../IO/schemas'
import { CallbackFns } from '../events/_types'
import { Subjects } from '../subjects'
import { AppLogger } from '../../helpers/logger'

export type CreateSendMessage = ReturnType<typeof createSendMessage>

export const createSendMessage =
  (subjects: Subjects, logger?: AppLogger) =>
  (callbackFns: Partial<CallbackFns>) =>
  (
    message: WalletInteraction
  ): ResultAsync<WalletInteractionSuccessResponse, SdkError> => {
    const cancelRequestSubject = new Subject<Err<never, SdkError>>()

    const walletResponse$ = subjects.responseSubject.pipe(
      filter((response) => response.interactionId === message.interactionId),
      map(
        (response): Result<WalletInteractionSuccessResponse, SdkError> =>
          'items' in response ? ok(response) : err(response)
      )
    )

    const cancelResponse$ = subjects.messageLifeCycleEventSubject.pipe(
      filter(
        ({ interactionId, eventType }) =>
          message.interactionId === interactionId &&
          ['requestCancelSuccess', 'requestCancelFail'].includes(eventType)
      ),
      map((message) => {
        const error = createSdkError(
          errorType.canceledByUser,
          message.interactionId
        )
        logger?.debug(`🔵⬆️❌ walletRequestCanceled`, error)
        cancelRequestSubject.next(err(error))
        return message
      })
    )

    const sendCancelRequest = () => {
      subjects.outgoingMessageSubject.next({
        interactionId: message.interactionId,
        items: { discriminator: 'cancelRequest' },
        metadata: message.metadata,
      })

      return ResultAsync.fromSafePromise(
        firstValueFrom(merge(walletResponse$, cancelResponse$))
      )
    }

    if (callbackFns.requestControl)
      callbackFns.requestControl({
        cancelRequest: () => sendCancelRequest().map(() => undefined),
        getRequest: () => message,
      })

    const walletResponseOrCancelRequest$ = merge(
      walletResponse$,
      cancelRequestSubject
    ).pipe(first())

    const messageLifeCycleEvent$ = subjects.messageLifeCycleEventSubject.pipe(
      filter(({ interactionId }) => message.interactionId === interactionId),
      tap((event) => {
        if (callbackFns.eventCallback)
          callbackFns.eventCallback(event.eventType)
      }),
      takeUntil(walletResponse$),
      share()
    )

    const messageEventSubscription = messageLifeCycleEvent$.subscribe()

    const missingExtensionError$ = timer(config.extensionDetectionTime).pipe(
      map(() =>
        err(createSdkError(errorType.missingExtension, message.interactionId))
      )
    )

    const extensionMissingError$ = merge(
      missingExtensionError$,
      messageLifeCycleEvent$
    ).pipe(
      first(),
      filter((value): value is Err<never, SdkError> => !('eventType' in value))
    )

    const sendWalletRequest$ = of(message).pipe(
      tap((message) => {
        subjects.outgoingMessageSubject.next(message)
      }),
      filter((_): _ is never => false)
    )

    return unwrapObservable(
      merge(
        walletResponseOrCancelRequest$,
        extensionMissingError$,
        sendWalletRequest$
      ).pipe(
        tap(() => {
          messageEventSubscription.unsubscribe()
        })
      )
    )
  }
