import { SubjectsType } from '../../messages/subjects'
import { RequestInput, RequestResponse, requestType } from './_types'
import { send } from '../../messages/send'
import { createRequestMessage } from './create-request-message'
import { response } from '../../utils'
import { GenericIncomingMessage } from '../../messages'
import { map } from 'rxjs'
import loglevel from 'loglevel'
import { createSdkError, SdkError } from '../../errors'
import { errAsync, Result } from 'neverthrow'
import { WalletResponses } from '../_types'

const mapRequestResponse = (
  result: Result<WalletResponses['request'], SdkError>
) =>
  result.map((input) =>
    Object.values(input).reduce<RequestResponse>((acc, value) => {
      switch (value.requestType) {
        case 'accountAddresses':
          return {
            ...acc,
            [requestType.accountAddresses]: value.addresses,
          }

        default:
          return acc
      }
    }, {})
  )

export const request = (subjects: SubjectsType) => (input: RequestInput) => {
  const result = createRequestMessage(input)

  if (result.isErr()) {
    loglevel.error(result.error)

    return response(
      errAsync(
        createSdkError('internal', '', 'could not construct outgoing message')
      )
    )
  }

  const request$ = send<GenericIncomingMessage<'request'>>(
    subjects,
    result.value
  ).pipe(map(mapRequestResponse))

  return response(request$)
}
