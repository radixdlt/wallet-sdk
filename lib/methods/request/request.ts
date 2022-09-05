import { SubjectsType } from '../../messages/subjects'
import { RequestDataInput, WalletResponses } from './_types'
import { send } from '../../messages/send'
import { createRequestMessage } from './create-request-message'
import { MethodResponse } from '../_types'
import { response } from '../../utils'
import { Message } from '../../messages'
import { of } from 'rxjs'
import loglevel from 'loglevel'
import { createSdkError } from '../../errors'
import { err } from 'neverthrow'

export const request =
  (subjects: SubjectsType) =>
  (
    input: RequestDataInput
  ): MethodResponse<WalletResponses['RequestWallet']> => {
    const result = createRequestMessage(input)

    if (result.isErr()) {
      loglevel.error(result.error)

      return response(
        of(
          err(
            createSdkError(
              'internal',
              '',
              'could not construct outgoing message'
            )
          )
        )
      )
    }

    const request$ = send<Message<'request', WalletResponses['RequestWallet']>>(
      subjects,
      result.value
    )

    return response(request$)
  }
