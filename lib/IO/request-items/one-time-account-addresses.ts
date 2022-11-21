import { AccountAddress, AccountAddressWithOwnershipProof } from './_types'

const oneTimeAccountAddressesRequestType = 'oneTimeAccountAddresses'
type OneTimeAccountAddressesRequestType =
  typeof oneTimeAccountAddressesRequestType

export type OneTimeAccountAddresses = {
  requestType: OneTimeAccountAddressesRequestType
  wallet: {
    request: {
      requestType: OneTimeAccountAddressesRequestType
    } & OneTimeAccountAddressesOutput
    response: {
      requestType: OneTimeAccountAddressesRequestType
      proofOfOwnership: false
      accountAddresses: AccountAddress[]
    }
  }
  method: {
    output: {
      oneTimeAccountAddresses: AccountAddress[]
    }
    input: OneTimeAccountAddressesOutput
  }
}
type OneTimeAccountAddressesOutput = ReturnType<
  ReturnType<typeof oneTimeAccountAddresses>
>[OneTimeAccountAddressesRequestType]

export const oneTimeAccountAddresses =
  (numberOfAddresses?: number) =>
  <I>(input: I extends { oneTimeAccountAddresses: any } ? never : I) => ({
    ...input,
    oneTimeAccountAddresses: numberOfAddresses
      ? {
          requiresProofOfOwnership: false,
          numberOfAddresses,
        }
      : {
          requiresProofOfOwnership: false,
        },
  })

const oneTimeAccountAddressesRequestTypeWithProofOfOwnership =
  'oneTimeAccountAddressesWithProofOfOwnership'
type OneTimeAccountAddressesRequestTypeWithProofOfOwnership =
  typeof oneTimeAccountAddressesRequestTypeWithProofOfOwnership

export type OneTimeAccountAddressesWithProofOfOwnership = {
  requestType: OneTimeAccountAddressesRequestTypeWithProofOfOwnership
  wallet: {
    request: {
      requestType: OneTimeAccountAddressesRequestType
    } & OneTimeAccountAddressesOutputWithProofOfOwnership
    response: {
      requestType: OneTimeAccountAddressesRequestType
      proofOfOwnership: true
      accountAddresses: AccountAddressWithOwnershipProof[]
    }
  }
  method: {
    output: {
      oneTimeAccountAddresses: AccountAddressWithOwnershipProof[]
    }
    input: OneTimeAccountAddressesOutputWithProofOfOwnership
  }
}

type OneTimeAccountAddressesOutputWithProofOfOwnership = ReturnType<
  ReturnType<typeof oneTimeAccountAddressesWithProofOfOwnership>
>[OneTimeAccountAddressesRequestTypeWithProofOfOwnership]

export const oneTimeAccountAddressesWithProofOfOwnership =
  (numberOfAddresses?: number) =>
  <I>(input: I extends { oneTimeAccountAddresses: any } ? never : I) => ({
    ...input,
    oneTimeAccountAddressesWithProofOfOwnership: numberOfAddresses
      ? {
          requiresProofOfOwnership: true,
          numberOfAddresses,
        }
      : {
          requiresProofOfOwnership: true,
        },
  })
