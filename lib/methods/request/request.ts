import { SubjectsType } from '../../messages/subjects'
import { RequestInput } from './_types'
import { sendMessage } from '../../messages/send-message'
import { createRequestMessage } from './create-request-message'
import { map } from 'rxjs'
import { createSdkError } from '../../errors'
import { errAsync } from 'neverthrow'
import { transformWalletResponse } from './transform-wallet-response'
import { createMethodResponse } from '../create-method-response'

export const request = (subjects: SubjectsType) => (input: RequestInput) => {
  const result = createRequestMessage(input)

  if (result.isErr())
    return createMethodResponse(
      errAsync(
        createSdkError('internal', '', 'could not construct outgoing message')
      )
    )

  const request$ = sendMessage<'request'>(subjects, result.value).pipe(
    map(transformWalletResponse)
  )

  return createMethodResponse(request$)
}
