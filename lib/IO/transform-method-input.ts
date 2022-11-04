import { ok } from 'neverthrow'
import { requestMethodRequestType } from '../methods/request'
import { requestType, Wallet } from '../_types'

const requestTypeMapper = new Map<
  keyof typeof requestType,
  keyof typeof requestType
>()
  .set(
    requestMethodRequestType.loginWithChallenge,
    requestMethodRequestType.login
  )
  .set(
    requestMethodRequestType.oneTimeAccountAddressesWithProofOfOwnership,
    requestMethodRequestType.oneTimeAccountAddresses
  )
  .set(
    requestMethodRequestType.ongoingAccountAddressesWithProofOfOwnership,
    requestMethodRequestType.ongoingAccountAddresses
  )

export const transformMethodInput = <I extends {}>(input: I) =>
  ok(
    Object.entries(input).reduce<Wallet['requestItem'][]>(
      (acc, [requestType, value]: [string, any]) => {
        switch (requestType) {
          case requestMethodRequestType.loginWithChallenge:
          case requestMethodRequestType.oneTimeAccountAddressesWithProofOfOwnership:
          case requestMethodRequestType.ongoingAccountAddressesWithProofOfOwnership:
            return [
              ...acc,
              {
                requestType: requestTypeMapper.get(requestType),
                ...value,
              },
            ]

          default:
            return [...acc, { requestType, ...value }]
        }
      },
      []
    )
  )
