import { ok } from 'neverthrow'
import { requestMethodRequestType } from '../methods/request'
import {
  NumberOfAccounts,
  ResetRequestItem,
  WalletInteractionItems,
  WalletUnauthorizedRequestItems,
} from './schemas'

export const provideDefaultNumberOfAccounts = (
  value: Partial<NumberOfAccounts>
): NumberOfAccounts => ({
  quantity: value?.quantity || 1,
  quantifier: value?.quantifier || 'atLeast',
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
          case requestMethodRequestType.oneTimeAccountsWithoutProofOfOwnership:
            return {
              ...acc,
              oneTimeAccounts: {
                requiresProofOfOwnership: false,
                numberOfAccounts: provideDefaultNumberOfAccounts(value),
              },
            }

          case requestMethodRequestType.oneTimeAccountsWithProofOfOwnership:
            return {
              ...acc,
              oneTimeAccounts: {
                requiresProofOfOwnership: true,
                numberOfAccounts: provideDefaultNumberOfAccounts(value),
              },
            }

          case requestMethodRequestType.ongoingAccountsWithProofOfOwnership:
            return {
              ...acc,
              ongoingAccounts: {
                requiresProofOfOwnership: true,
                numberOfAccounts: provideDefaultNumberOfAccounts(value),
              },
            }

          case requestMethodRequestType.ongoingAccountsWithoutProofOfOwnership:
            return {
              ...acc,
              ongoingAccounts: {
                requiresProofOfOwnership: false,
                numberOfAccounts: provideDefaultNumberOfAccounts(value),
              },
            }

          case requestMethodRequestType.loginWithoutChallenge:
            return {
              ...acc,
              auth: { ...value, discriminator: 'login' },
              discriminator: 'authorizedRequest',
            }

          case requestMethodRequestType.usePersona:
            return {
              ...acc,
              auth: { ...value, discriminator: 'usePersona' },
              discriminator: 'authorizedRequest',
            }

          case requestMethodRequestType.loginWithChallenge:
            return {
              ...acc,
              auth: value,
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
