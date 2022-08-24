import { createMessage, Message, SubjectsType } from '../../messages'
import { send } from '../../messages/send'
import { MethodResponse, SdkError } from '../_types'
import { TransactionWalletResponse } from './_types'
import { response } from '../../utils'
import loglevel from 'loglevel'
import { err, Err } from 'neverthrow'
import { of } from 'rxjs'

export const sendTransaction =
  (subjects: SubjectsType) =>
  (transactionManifest: string): MethodResponse<TransactionWalletResponse> => {
    const result = createMessage({
      method: 'sendTransaction',
      payload: transactionManifest,
    })

    if (result.isErr()) {
      loglevel.error(result.error)

      const error: Err<never, SdkError> = err({
        error: 'internal',
        message: 'could not construct outgoing message',
      })

      return response(of(error))
    }

    const request$ = send<
      Message<'sendTransaction', TransactionWalletResponse>
    >(subjects, result.value)

    return response(request$)
  }
