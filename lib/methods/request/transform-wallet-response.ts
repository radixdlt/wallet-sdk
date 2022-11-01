import { RequestMethodResponse, requestType } from './_types'
import { SdkError } from '../../errors'
import { Result } from 'neverthrow'
import { WalletResponses } from '../_types'

export const transformWalletResponse = (
  result: Result<WalletResponses['request'], SdkError>
) =>
  result.map((input) =>
    input.reduce<RequestMethodResponse>((acc, value) => {
      switch (value.requestType) {
        case requestType.accountAddresses:
          return {
            ...acc,
            [requestType.accountAddresses]: value.addresses,
          }

        case requestType.personaData:
          return {
            ...acc,
            [requestType.personaData]: value.personaData,
          }

        case requestType.login: {
          const { challenge, signature, publicKey, identityComponentAddress } =
            value
          return {
            ...acc,
            [requestType.login]: {
              challenge,
              signature,
              publicKey,
              identityComponentAddress,
            },
          }
        }

        default:
          return acc
      }
    }, {})
  )
