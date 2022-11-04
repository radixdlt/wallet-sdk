export type AccountAddress = { label: string; address: string }
export type OwnershipProof = { challenge: string; signature: string }
export type AccountAddressWithOwnershipProof = AccountAddress & OwnershipProof
export type PersonaDataField = { field: string; value: string }
