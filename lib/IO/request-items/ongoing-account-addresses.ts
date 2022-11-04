import { AccountAddress, AccountAddressWithOwnershipProof } from './_types'

const ongoingAccountAddressesRequestType = 'ongoingAccountAddresses'
type OngoingAccountAddressesRequestType =
  typeof ongoingAccountAddressesRequestType

export type OngoingAccountAddresses = {
  requestType: OngoingAccountAddressesRequestType
  wallet: {
    request: {
      requestType: OngoingAccountAddressesRequestType
    } & OngoingAccountAddressesOutput
    response: {
      requestType: OngoingAccountAddressesRequestType
      proofOfOwnership: false
      accountAddresses: AccountAddress[]
    }
  }
  method: {
    input: OngoingAccountAddressesOutput
    output: { ongoingAccountAddresses: AccountAddress[] }
  }
}

type OngoingAccountAddressesOutput = ReturnType<
  ReturnType<typeof ongoingAccountAddresses>
>[OngoingAccountAddressesRequestType]

export const ongoingAccountAddresses =
  (numberOfAddresses?: number) =>
  <I extends { persona: any } | { login: any } | { loginWithChallenge: any }>(
    input: I extends
      | { ongoingAccountAddresses: any }
      | { ongoingAccountAddressesWithProofOfOwnership: any }
      ? never
      : I
  ) => ({
    ...input,
    ongoingAccountAddresses: numberOfAddresses
      ? {
          proofOfOwnership: false,
          numberOfAddresses,
        }
      : {
          proofOfOwnership: false,
        },
  })

const ongoingAccountAddressesWithProofOfOwnershipRequestType =
  'ongoingAccountAddressesWithProofOfOwnership'
type OngoingAccountAddressesWithProofOfOwnershipRequestType =
  typeof ongoingAccountAddressesWithProofOfOwnershipRequestType

export type OngoingAccountAddressesWithProofOfOwnership = {
  requestType: OngoingAccountAddressesWithProofOfOwnershipRequestType
  wallet: {
    request: {
      requestType: OngoingAccountAddressesRequestType
    } & OngoingAccountAddressesWithProofOfOwnershipOutput
    response: {
      requestType: OngoingAccountAddressesRequestType
      proofOfOwnership: true
      accountAddresses: AccountAddressWithOwnershipProof[]
    }
  }
  method: {
    input: OngoingAccountAddressesWithProofOfOwnershipOutput
    output: { ongoingAccountAddresses: AccountAddressWithOwnershipProof[] }
  }
}

type OngoingAccountAddressesWithProofOfOwnershipOutput = ReturnType<
  ReturnType<typeof ongoingAccountAddressesWithProofOfOwnership>
>[OngoingAccountAddressesWithProofOfOwnershipRequestType]

export const ongoingAccountAddressesWithProofOfOwnership =
  (numberOfAddresses?: number) =>
  <I extends { persona: any } | { login: any } | { loginWithChallenge: any }>(
    input: I extends
      | { ongoingAccountAddresses: any }
      | { ongoingAccountAddressesWithProofOfOwnership: any }
      ? never
      : I
  ) => ({
    ...input,
    ongoingAccountAddressesWithProofOfOwnership: numberOfAddresses
      ? {
          proofOfOwnership: true,
          numberOfAddresses,
        }
      : { proofOfOwnership: true },
  })
