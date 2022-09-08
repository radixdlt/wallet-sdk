import { SubjectsType } from '../../messages/subjects'
import { RequestMethodInput } from './_types'
import { sendMessage } from '../../messages/observables/send-message'
import { createRequestMessage } from './create-request-message'
import { map } from 'rxjs'
import { createSdkError } from '../../errors'
import { errAsync } from 'neverthrow'
import { transformWalletResponse } from './transform-wallet-response'
import { createMethodResponse } from '../create-method-response'
import { MessageLifeCycleEvent } from '../../messages/events/_types'

export const request =
  (subjects: SubjectsType) =>
  (
    input: RequestMethodInput,
    eventCallback?: (messageEvent: MessageLifeCycleEvent) => void
  ) => {
    const result = createRequestMessage(input)

    if (result.isErr())
      return createMethodResponse(
        errAsync(
          createSdkError('internal', '', 'could not construct outgoing message')
        )
      )

    const message = result.value

    const walletRequest$ = sendMessage<'request'>(
      subjects,
      message,
      eventCallback
    ).pipe(map(transformWalletResponse))

    return createMethodResponse(walletRequest$)
  }
