export const requestType = {
  accountAddresses: 'accountAddresses',
  personaData: 'personaData',
} as const

export type RequestTypes = keyof typeof requestType

export type AccountAddress = typeof requestType['accountAddresses']

export type AccountAddressRequest = {
  requestType: AccountAddress
}

export type Address = { label: string; address: string }

export type AccountAddressWalletResponse = {
  requestType: AccountAddress
  addresses: Address[]
}

export type RequestItem = AccountAddressRequest
export type Request = RequestItem[]

export type RequestInput = Partial<{
  accountAddresses: Omit<AccountAddressRequest, 'requestType'>
}>

export type RequestResponse = Partial<{
  [requestType.accountAddresses]: AccountAddressWalletResponse['addresses']
}>
