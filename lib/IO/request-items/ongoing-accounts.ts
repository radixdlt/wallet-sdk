import {
  Account,
  AccountWithProofOfOwnership,
  OngoingAccountsReadRequestItem,
  OngoingAccountsResponseItem,
} from '../schemas'

export type OngoingAccounts = {
  WithoutProofOfOwnership: {
    wallet: {
      request: OngoingAccountsReadRequestItem
      response: OngoingAccountsResponseItem
    }
    method: {
      input: { numberOfAccounts?: number }
      output: { ongoingAccounts: Account[] }
    }
  }
  WithProofOfOwnership: {
    wallet: {
      request: OngoingAccountsReadRequestItem
      response: OngoingAccountsResponseItem
    }
    method: {
      input: { numberOfAccounts?: number }
      output: { ongoingAccounts: AccountWithProofOfOwnership[] }
    }
  }
}

type RequiredKeys =
  | { persona: any }
  | { loginWithoutChallenge: any }
  | { loginWithChallenge: any }

type NotAllowedKeys = Partial<{
  ongoingAccounts: any
  ongoingAccountsWithProofOfOwnership: any
}>

export const ongoingAccounts = {
  withoutProofOfOwnership:
    (numberOfAccounts?: number) =>
    <I extends RequiredKeys>(input: I extends NotAllowedKeys ? never : I) => ({
      ...input,
      ongoingAccountsWithoutProofOfOwnership: {
        numberOfAccounts,
      },
    }),
  withProofOfOwnership:
    (numberOfAccounts?: number) =>
    <I extends RequiredKeys>(input: I extends NotAllowedKeys ? never : I) => ({
      ...input,
      ongoingAccountsWithProofOfOwnership: {
        numberOfAccounts,
      },
    }),
}
