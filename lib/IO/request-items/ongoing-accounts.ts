import { config } from '../../config'
import {
  Account,
  AccountWithProofOfOwnership,
  NumberOfAccountsQuantifier,
  OngoingAccountsWithProofOfOwnershipRequestItem,
  OngoingAccountsWithoutProofOfOwnershipRequestItem,
  OngoingAccountsWithoutProofOfOwnershipRequestResponseItem,
  OngoingAccountsWithProofOfOwnershipRequestResponseItem,
} from '../schemas'

export type OngoingAccounts = {
  WithoutProofOfOwnership: {
    wallet: {
      request: OngoingAccountsWithoutProofOfOwnershipRequestItem
      response: OngoingAccountsWithoutProofOfOwnershipRequestResponseItem
    }
    method: {
      input: {
        quantity: number
        quantifier: NumberOfAccountsQuantifier
      }
      output: { ongoingAccounts: Account[] }
    }
  }
  WithProofOfOwnership: {
    wallet: {
      request: OngoingAccountsWithProofOfOwnershipRequestItem
      response: OngoingAccountsWithProofOfOwnershipRequestResponseItem
    }
    method: {
      input: {
        quantity: number
        quantifier: NumberOfAccountsQuantifier
      }
      output: { ongoingAccounts: AccountWithProofOfOwnership[] }
    }
  }
}

type RequiredKeys =
  | { usePersona: any }
  | { loginWithoutChallenge: any }
  | { loginWithChallenge: any }

type NotAllowedKeys = Partial<{
  ongoingAccounts: any
  ongoingAccountsWithProofOfOwnership: any
}>

export const ongoingAccounts = {
  withoutProofOfOwnership:
    (
      quantity = config.defaultNumberOfAccountsQuantity,
      quantifier = config.defaultNumberOfAccountsQuantifier
    ) =>
    <I extends RequiredKeys>(input: I extends NotAllowedKeys ? never : I) => ({
      ...input,
      ongoingAccountsWithoutProofOfOwnership: {
        discriminator: 'ongoingAccountsWithoutProofOfOwnership',
        quantity,
        quantifier,
      },
    }),
  withProofOfOwnership:
    (
      challenge: string,
      quantity = config.defaultNumberOfAccountsQuantity,
      quantifier = config.defaultNumberOfAccountsQuantifier
    ) =>
    <I extends RequiredKeys>(input: I extends NotAllowedKeys ? never : I) => ({
      ...input,
      ongoingAccountsWithProofOfOwnership: {
        discriminator: 'ongoingAccountsWithProofOfOwnership',
        quantity,
        quantifier,
        challenge,
      },
    }),
}
