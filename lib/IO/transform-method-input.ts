import { ok } from 'neverthrow'
import { requestMethodRequestType } from '../methods/request'
import { Wallet } from '../_types'
import { RequestTypeSchema } from './schemas'

const requestTypeMapper = new Map<string, string>()
  .set(
    requestMethodRequestType.oneTimeAccountsWithoutProofOfOwnership,
    RequestTypeSchema.oneTimeAccountsRead.value
  )
  .set(
    requestMethodRequestType.oneTimeAccountsWithProofOfOwnership,
    RequestTypeSchema.oneTimeAccountsRead.value
  )
  .set(
    requestMethodRequestType.ongoingAccountsWithProofOfOwnership,
    RequestTypeSchema.ongoingAccountsRead.value
  )
  .set(
    requestMethodRequestType.ongoingAccountsWithoutProofOfOwnership,
    RequestTypeSchema.ongoingAccountsRead.value
  )
  .set(
    requestMethodRequestType.loginWithChallenge,
    RequestTypeSchema.loginRead.value
  )
  .set(
    requestMethodRequestType.loginWithoutChallenge,
    RequestTypeSchema.loginRead.value
  )
  .set(
    requestMethodRequestType.usePersona,
    RequestTypeSchema.usePersonaRead.value
  )
  .set(
    requestMethodRequestType.oneTimePersonaData,
    RequestTypeSchema.oneTimePersonaDataRead.value
  )
  .set(
    requestMethodRequestType.ongoingPersonaData,
    RequestTypeSchema.ongoingPersonaDataRead.value
  )
  .set('sendTransaction', RequestTypeSchema.sendTransactionWrite.value)

export const transformMethodInput = <I extends {}>(input: I) =>
  ok(
    Object.entries(input).reduce<Wallet['requestItem'][]>(
      (acc, [requestType, value]: [string, any]) => {
        switch (requestType) {
          case requestMethodRequestType.oneTimeAccountsWithoutProofOfOwnership:
            return [
              ...acc,
              {
                requestType: RequestTypeSchema.oneTimeAccountsRead.value,
                ...value,
                requiresProofOfOwnership: false,
              },
            ]

          default:
            return [
              ...acc,
              { requestType: requestTypeMapper.get(requestType), ...value },
            ]
        }
      },
      []
    )
  )
