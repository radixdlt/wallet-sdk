import loglevel from 'loglevel'
import { errAsync } from 'neverthrow'
import { createSdkError } from '../../errors'
import { SendMessage } from '../../messages/observables/send-message'
import { createMethodResponse } from '../create-method-response'
import { methodType } from '../_types'
import { MessageLifeCycleEvent } from '../../messages/events/_types'
import { createMessage } from '../../messages'
import { SendTransactionMethodInput } from './_types'
import { map } from 'rxjs'

export const createSendTransactionMessage = (
  input: SendTransactionMethodInput
) =>
  createMessage({
    method: methodType.sendTransaction,
    payload: [{ requestType: methodType.sendTransaction, ...input }],
  })

export const sendTransaction =
  (sendMessage: SendMessage) =>
  (
    input: SendTransactionMethodInput,
    eventCallback?: (messageEvent: MessageLifeCycleEvent) => void
  ) => {
    const result = createSendTransactionMessage(input)

    if (result.isErr()) {
      loglevel.error(result.error)

      return createMethodResponse(
        errAsync(
          createSdkError('internal', '', 'could not construct outgoing message')
        )
      )
    }

    const walletRequest$ = sendMessage<'sendTransaction'>(
      result.value,
      eventCallback
    ).pipe(
      map((result) =>
        result.map(([{ transactionIntentHash }]) => ({ transactionIntentHash }))
      )
    )

    return createMethodResponse(walletRequest$)
  }
