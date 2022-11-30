import {
  Account,
  AccountWithProofOfOwnership,
  OneTimeAccountsReadRequestItem,
  OneTimeAccountsWithoutProofOfOwnershipResponseItem,
  OneTimeAccountsWithProofOfOwnershipResponseItem,
} from '../schemas'

export type OneTimeAccounts = {
  WithoutProofOfOwnership: {
    wallet: {
      request: OneTimeAccountsReadRequestItem
      response: OneTimeAccountsWithoutProofOfOwnershipResponseItem
    }
    method: {
      input: { numberOfAddresses?: number }
      output: {
        oneTimeAccounts: Account[]
      }
    }
  }
  WithProofOfOwnership: {
    wallet: {
      request: OneTimeAccountsReadRequestItem
      response: OneTimeAccountsWithProofOfOwnershipResponseItem
    }
    method: {
      input: { numberOfAddresses?: number }
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
    (numberOfAddresses?: number) =>
    <I>(input: I extends NotAllowedKeys ? never : I) => ({
      ...input,
      oneTimeAccountsWithoutProofOfOwnership: {
        requiresProofOfOwnership: false,
        numberOfAddresses,
      },
    }),
  withProofOfOwnership:
    (numberOfAddresses?: number) =>
    <I>(input: I extends NotAllowedKeys ? never : I) => ({
      ...input,
      oneTimeAccountsWithProofOfOwnership: {
        requiresProofOfOwnership: true,
        numberOfAddresses,
      },
    }),
}
