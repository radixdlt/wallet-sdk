import { createMessage, Message, SubjectsType } from '../../messages'
import { send } from '../../messages/send'
import { MethodResponse } from '../_types'
import { TransactionWalletResponse } from './_types'
import { response } from '../../utils'
import loglevel from 'loglevel'
import { err } from 'neverthrow'
import { of } from 'rxjs'
import { createSdkError } from '../../errors'

export const sendTransaction =
  (subjects: SubjectsType) =>
  (transactionManifest: string): MethodResponse<TransactionWalletResponse> => {
    const result = createMessage({
      method: 'sendTransaction',
      payload: transactionManifest,
    })

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

    const request$ = send<
      Message<'sendTransaction', TransactionWalletResponse>
    >(subjects, result.value)

    return response(request$)
  }
