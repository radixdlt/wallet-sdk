export type AccountAddress = { label: string; address: string }
export type OwnershipProof = { challenge: string; signature: string }
export type AccountAddressWithOwnershipProof = OwnershipProof & {
  accountAddress: AccountAddress
}
export type PersonaDataField = { field: string; value: string }
