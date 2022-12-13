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
      input: { numberOfAccounts?: number }
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
      input: { numberOfAccounts?: number }
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
    (numberOfAccounts?: number) =>
    <I>(input: I extends NotAllowedKeys ? never : I) => ({
      ...input,
      oneTimeAccountsWithoutProofOfOwnership: {
        numberOfAccounts,
      },
    }),
  withProofOfOwnership:
    (numberOfAccounts?: number) =>
    <I>(input: I extends NotAllowedKeys ? never : I) => ({
      ...input,
      oneTimeAccountsWithProofOfOwnership: {
        numberOfAccounts,
      },
    }),
}
