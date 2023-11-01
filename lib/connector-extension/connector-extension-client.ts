import { Subjects } from './subjects'
import { AppLogger } from '../helpers/logger'
import {
  CallbackFns,
  IncomingMessage,
  MessageLifeCycleExtensionStatusEvent,
  WalletInteraction,
  WalletInteractionSuccessResponse,
  eventType,
} from '@radixdlt/radix-connect-schemas'
import { Err, Result, ResultAsync, err, ok } from 'neverthrow'
import { SdkError, createSdkError } from '../wallet-sdk'
import {
  Subject,
  Subscription,
  filter,
  first,
  firstValueFrom,
  map,
  merge,
  of,
  race,
  share,
  switchMap,
  takeUntil,
  tap,
  timer,
} from 'rxjs'
import { unwrapObservable } from '../helpers/unwrap-observable'
import { config } from '../config'

export type ConnectorExtensionClient = ReturnType<
  typeof ConnectorExtensionClient
>

export const ConnectorExtensionClient = (
  input?: Partial<{
    subjects: Subjects
    logger: AppLogger
  }>
) => {
  const logger = input?.logger
  const subjects = input?.subjects ?? Subjects()
  const subscription = new Subscription()

  subscription.add(
    subjects.incomingMessageSubject
      .pipe(
        tap((message) => {
          if ('eventType' in message) {
            logger?.debug(`🔵💬⬇️ messageLifecycleEvent`, message)
            subjects.messageLifeCycleEventSubject.next(message)
          } else {
            logger?.debug(`🔵⬇️ walletResponse`, message)
            subjects.responseSubject.next(message)
          }
        })
      )
      .subscribe()
  )
  subscription.add(
    subjects.outgoingMessageSubject
      .pipe(
        tap((payload) => {
          logger?.debug(`🔵⬆️ walletRequest`, payload)
          window.dispatchEvent(
            new CustomEvent(eventType.outgoingMessage, {
              detail: payload,
            })
          )
        })
      )
      .subscribe()
  )

  const handleIncomingMessage = (event: Event) => {
    const message = (event as CustomEvent<IncomingMessage>).detail
    subjects.incomingMessageSubject.next(message)
  }

  addEventListener(eventType.incomingMessage, handleIncomingMessage)

  const sendWalletInteraction = (
    walletInteraction: WalletInteraction,
    callbackFns: Partial<CallbackFns>
  ): ResultAsync<unknown, SdkError> => {
    const cancelRequestSubject = new Subject<Err<never, SdkError>>()

    const walletResponse$ = subjects.responseSubject.pipe(
      filter(
        (response) => response.interactionId === walletInteraction.interactionId
      ),
      map(
        (response): Result<WalletInteractionSuccessResponse, SdkError> =>
          response.discriminator === 'success'
            ? ok(response)
            : err(response as SdkError)
      )
    )

    const cancelResponse$ = subjects.messageLifeCycleEventSubject.pipe(
      filter(
        ({ interactionId, eventType }) =>
          walletInteraction.interactionId === interactionId &&
          ['requestCancelSuccess', 'requestCancelFail'].includes(eventType)
      ),
      map((message) => {
        const error = createSdkError('canceledByUser', message.interactionId)
        logger?.debug(`🔵⬆️❌ walletRequestCanceled`, error)
        return message
      })
    )

    const sendCancelRequest = () => {
      subjects.outgoingMessageSubject.next({
        interactionId: walletInteraction.interactionId,
        items: { discriminator: 'cancelRequest' },
        metadata: walletInteraction.metadata,
      })

      setTimeout(() => {
        cancelRequestSubject.next(
          err(createSdkError('canceledByUser', walletInteraction.interactionId))
        )
      })

      return ResultAsync.fromSafePromise(
        firstValueFrom(
          merge(
            walletResponse$.pipe(map(() => 'requestCancelFail')),
            cancelResponse$.pipe(map(({ eventType }) => eventType))
          )
        )
      )
    }

    if (callbackFns.requestControl)
      callbackFns.requestControl({
        cancelRequest: () =>
          sendCancelRequest().andThen(
            (eventType): Result<'requestCancelSuccess', 'requestCancelFail'> =>
              eventType === 'requestCancelSuccess'
                ? ok('requestCancelSuccess')
                : err('requestCancelFail')
          ),
        getRequest: () => walletInteraction,
      })

    const walletResponseOrCancelRequest$ = merge(
      walletResponse$,
      cancelRequestSubject
    ).pipe(first())

    const messageLifeCycleEvent$ = subjects.messageLifeCycleEventSubject.pipe(
      filter(
        ({ interactionId }) => walletInteraction.interactionId === interactionId
      ),
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
        err(createSdkError('missingExtension', walletInteraction.interactionId))
      )
    )

    const extensionMissingError$ = merge(
      missingExtensionError$,
      messageLifeCycleEvent$
    ).pipe(
      first(),
      filter((value): value is Err<never, SdkError> => !('eventType' in value))
    )

    const sendWalletRequest$ = of(walletInteraction).pipe(
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

  const extensionStatusEvent$ = subjects.messageLifeCycleEventSubject.pipe(
    filter(
      (event): event is MessageLifeCycleExtensionStatusEvent =>
        event.eventType === 'extensionStatus'
    )
  )

  return {
    send: sendWalletInteraction,
    destroy: () => {
      subscription.unsubscribe()
      removeEventListener(eventType.incomingMessage, handleIncomingMessage)
    },
    openPopup: () => {
      subjects.outgoingMessageSubject.next({
        interactionId: crypto.randomUUID(),
        discriminator: 'openPopup',
      })
    },
    extensionStatus$: of(true).pipe(
      map(() => {
        const interactionId = crypto.randomUUID()
        subjects.outgoingMessageSubject.next({
          interactionId,
          discriminator: 'extensionStatus',
        })
        return interactionId
      }),
      switchMap((interactionId) =>
        race(
          extensionStatusEvent$,
          merge(
            extensionStatusEvent$,
            timer(config.extensionDetectionTime).pipe(
              map(
                (): MessageLifeCycleExtensionStatusEvent => ({
                  interactionId,
                  eventType: 'extensionStatus',
                  isWalletLinked: false,
                  isExtensionAvailable: false,
                })
              )
            )
          )
        )
      )
    ),
  }
}
