import { config } from '../../config'
import {
  Account,
  AccountWithProofOfOwnership,
  NumberOfAccountsQuantifier,
  OneTimeAccountsWithoutProofOfOwnershipRequestItem,
  OneTimeAccountsWithoutProofOfOwnershipRequestResponseItem,
  OneTimeAccountsWithProofOfOwnershipRequestItem,
  OneTimeAccountsWithProofOfOwnershipRequestResponseItem,
} from '../schemas'

export type OneTimeAccounts = {
  WithoutProofOfOwnership: {
    wallet: {
      request: OneTimeAccountsWithoutProofOfOwnershipRequestItem
      response: OneTimeAccountsWithoutProofOfOwnershipRequestResponseItem
    }
    method: {
      input: {
        quantity?: number
        quantifier?: NumberOfAccountsQuantifier
      }
      output: {
        oneTimeAccounts: Account[]
      }
    }
  }
  WithProofOfOwnership: {
    wallet: {
      request: OneTimeAccountsWithProofOfOwnershipRequestItem
      response: OneTimeAccountsWithProofOfOwnershipRequestResponseItem
    }
    method: {
      input: {
        quantity?: number
        quantifier?: NumberOfAccountsQuantifier
        challenge: string
      }
      output: {
        oneTimeAccounts: AccountWithProofOfOwnership[]
      }
    }
  }
}

type NotAllowedKeys = Partial<{
  oneTimeAccountsWithProofOfOwnership: any
  oneTimeAccountsWithoutProofOfOwnership: any
}>

export const oneTimeAccounts = {
  withoutProofOfOwnership:
    (
      quantity = config.defaultNumberOfAccountsQuantity,
      quantifier = config.defaultNumberOfAccountsQuantifier
    ) =>
    <I>(input: I extends NotAllowedKeys ? never : I) => ({
      ...input,
      oneTimeAccountsWithoutProofOfOwnership: {
        discriminator: 'oneTimeAccountsWithoutProofOfOwnership',
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
    <I>(input: I extends NotAllowedKeys ? never : I) => ({
      ...input,
      oneTimeAccountsWithProofOfOwnership: {
        discriminator: 'oneTimeAccountsWithProofOfOwnership',
        quantity,
        quantifier,
        challenge,
      },
    }),
}
