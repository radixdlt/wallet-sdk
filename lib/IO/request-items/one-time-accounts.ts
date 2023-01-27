import { config } from '../../config'
import {
  Account,
  AccountWithProofOfOwnership,
  NumberOfAccountsQuantifier,
  OneTimeAccountsRequestItem,
  OneTimeAccountsWithoutProofOfOwnershipRequestResponseItem,
  OneTimeAccountsWithProofOfOwnershipRequestResponseItem,
} from '../schemas'

export type OneTimeAccounts = {
  WithoutProofOfOwnership: {
    wallet: {
      request: OneTimeAccountsRequestItem
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
      request: OneTimeAccountsRequestItem
      response: OneTimeAccountsWithProofOfOwnershipRequestResponseItem
    }
    method: {
      input: {
        quantity?: number
        quantifier?: NumberOfAccountsQuantifier
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
        quantity,
        quantifier,
      },
    }),
  withProofOfOwnership:
    (
      quantity = config.defaultNumberOfAccountsQuantity,
      quantifier = config.defaultNumberOfAccountsQuantifier
    ) =>
    <I>(input: I extends NotAllowedKeys ? never : I) => ({
      ...input,
      oneTimeAccountsWithProofOfOwnership: {
        quantity,
        quantifier,
      },
    }),
}
