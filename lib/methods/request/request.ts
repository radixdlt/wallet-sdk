import { SubjectsType } from '../../messages/subjects'
import { RequestDataInput, RequestWalletResponse } from './_types'
import { send } from '../../messages/send'
import { createRequestMessage } from './create-request-message'
import { MethodResponse, SdkError } from '../_types'
import { response } from '../../utils'
import { Message } from '../../messages'
import { of } from 'rxjs'
import { err, Err } from 'neverthrow'
import loglevel from 'loglevel'

export const request =
  (subjects: SubjectsType) =>
  (input: RequestDataInput): MethodResponse<RequestWalletResponse> => {
    const result = createRequestMessage(input)

    if (result.isErr()) {
      loglevel.error(result.error)

      const error: Err<never, SdkError> = err({
        error: 'internal',
        message: 'could not construct outgoing message',
      })

      return response(of(error))
    }

    const request$ = send<Message<'request', RequestWalletResponse>>(
      subjects,
      result.value
    )

    return response(request$)
  }
