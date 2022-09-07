import { createMessage, SubjectsType } from '../../messages'
import loglevel from 'loglevel'
import { errAsync } from 'neverthrow'
import { createSdkError } from '../../errors'
import { sendMessage } from '../../messages/send-message'
import { createMethodResponse } from '../create-method-response'

export const sendTransaction =
  (subjects: SubjectsType) => (transactionManifest: string) => {
    const result = createMessage({
      method: 'sendTransaction',
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

    const request$ = sendMessage<'sendTransaction'>(subjects, result.value)

    return createMethodResponse(request$)
  }
