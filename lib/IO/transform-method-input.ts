import { ok } from 'neverthrow'
import { requestMethodRequestType } from '../methods/request'
import {
  NumberOfAccounts,
  OneTimeAccountsWithProofOfOwnershipRequestItem,
  OneTimeAccountsWithoutProofOfOwnershipRequestItem,
  OngoingAccountsWithProofOfOwnershipRequestItem,
  OngoingAccountsWithoutProofOfOwnershipRequestItem,
  ResetRequestItem,
  WalletInteractionItems,
  WalletUnauthorizedRequestItems,
} from './schemas'

export const provideDefaultNumberOfAccounts = (
  value: Partial<NumberOfAccounts>
): NumberOfAccounts => ({
  quantity: value?.quantity ?? 1,
  quantifier: value?.quantifier ?? 'atLeast',
})

const removeResetForUnauthorizedRequest = (value: WalletInteractionItems) => {
  if (
    value.discriminator === 'transaction' ||
    value.discriminator === 'authorizedRequest'
  )
    return value

  const { reset, ...rest } = value as WalletUnauthorizedRequestItems & {
    reset: ResetRequestItem
  }

  return rest
}

export const transformMethodInput = <I extends {}>(input: I) =>
  ok(
    Object.entries(input).reduce<WalletInteractionItems>(
      (acc, [requestType, value]: [string, any]) => {
        switch (requestType) {
          case requestMethodRequestType.oneTimeAccountsWithoutProofOfOwnership: {
            const oneTimeAccounts: OneTimeAccountsWithoutProofOfOwnershipRequestItem =
              {
                discriminator: 'oneTimeAccountsWithoutProofOfOwnership',
                numberOfAccounts: provideDefaultNumberOfAccounts(value),
              }
            return {
              ...acc,
              oneTimeAccounts,
            }
          }

          case requestMethodRequestType.oneTimeAccountsWithProofOfOwnership: {
            const oneTimeAccounts: OneTimeAccountsWithProofOfOwnershipRequestItem =
              {
                discriminator: 'oneTimeAccountsWithProofOfOwnership',
                numberOfAccounts: provideDefaultNumberOfAccounts(value),
                challenge: value.challenge,
              }
            return {
              ...acc,
              oneTimeAccounts,
            }
          }

          case requestMethodRequestType.ongoingAccountsWithProofOfOwnership: {
            const ongoingAccounts: OngoingAccountsWithProofOfOwnershipRequestItem =
              {
                discriminator: 'ongoingAccountsWithProofOfOwnership',
                numberOfAccounts: provideDefaultNumberOfAccounts(value),
                challenge: value.challenge,
              }
            return {
              ...acc,
              ongoingAccounts,
            }
          }

          case requestMethodRequestType.ongoingAccountsWithoutProofOfOwnership: {
            const ongoingAccounts: OngoingAccountsWithoutProofOfOwnershipRequestItem =
              {
                discriminator: 'ongoingAccountsWithoutProofOfOwnership',
                numberOfAccounts: provideDefaultNumberOfAccounts(value),
              }
            return {
              ...acc,
              ongoingAccounts,
            }
          }

          case requestMethodRequestType.oneTimePersonaData:
            return {
              ...acc,
              oneTimePersonaData: {
                fields: value.fields,
              },
            }

          case requestMethodRequestType.ongoingPersonaData:
            return {
              ...acc,
              ongoingPersonaData: {
                fields: value.fields,
              },
            }

          case requestMethodRequestType.loginWithoutChallenge:
            return {
              ...acc,
              auth: { discriminator: 'loginWithoutChallenge' },
              discriminator: 'authorizedRequest',
            }

          case requestMethodRequestType.loginWithChallenge: {
            const { challenge } = value
            return {
              ...acc,
              auth: { challenge, discriminator: 'loginWithChallenge' },
              discriminator: 'authorizedRequest',
            }
          }

          case requestMethodRequestType.usePersona:
            return {
              ...acc,
              auth: { ...value, discriminator: 'usePersona' },
              discriminator: 'authorizedRequest',
            }

          case requestMethodRequestType.reset: {
            const { accounts = false, personaData = false } = value
            if (!accounts && !personaData) return acc
            return {
              ...acc,
              reset: { accounts, personaData },
            }
          }

          case 'send':
            return {
              discriminator: 'transaction',
              send: value,
            }

          default:
            return {
              ...acc,
              [requestType]: value,
            }
        }
      },
      {
        discriminator: 'unauthorizedRequest',
      }
    )
  ).map(removeResetForUnauthorizedRequest)
