import { createMessage, SubjectsType } from '../../messages'
import loglevel from 'loglevel'
import { errAsync } from 'neverthrow'
import { createSdkError } from '../../errors'
import { sendMessage } from '../../messages/observables/send-message'
import { createMethodResponse } from '../create-method-response'
import { methodType } from '../_types'

export const sendTransaction =
  (subjects: SubjectsType) => (transactionManifest: string) => {
    const result = createMessage({
      method: methodType.sendTransaction,
      payload: transactionManifest,
    })

    if (result.isErr()) {
      loglevel.error(result.error)

      return createMethodResponse(
        errAsync(
          createSdkError('internal', '', 'could not construct outgoing message')
        )
      )
    }

    const walletRequest$ = sendMessage<'sendTransaction'>(
      subjects,
      result.value
    )

    return createMethodResponse(walletRequest$)
  }
