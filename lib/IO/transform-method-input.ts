import { ok } from 'neverthrow'
import { requestMethodRequestType } from '../methods/request'
import { NumberOfAccounts, WalletInteractionItems } from './schemas'

export const provideDefaultNumberOfAccounts = (
  value: Partial<NumberOfAccounts>
): NumberOfAccounts => ({
  quantity: value?.quantity || 1,
  quantifier: value?.quantifier || 'atLeast',
})

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

          case requestMethodRequestType.usePersona:
          case requestMethodRequestType.loginWithChallenge:
          case requestMethodRequestType.loginWithoutChallenge:
            return {
              ...acc,
              auth: value,
              discriminator: 'authorizedRequest',
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
  )
