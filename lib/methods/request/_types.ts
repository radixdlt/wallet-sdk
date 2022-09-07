export const requestType = {
  accountAddresses: 'accountAddresses',
} as const

export type RequestTypes = keyof typeof requestType

export type AccountAddresses = typeof requestType['accountAddresses']

export type AccountAddressRequest = {
  requestType: AccountAddresses
}

export type AccountAddressResponse = {
  requestType: AccountAddresses
  addresses: Address[]
}

type Address = { label: string; address: string }

export type RequestWalletResponse = {
  [requestType.accountAddresses]: AccountAddressResponse
}

export type RequestWalletResponseType = RequestWalletResponse[RequestTypes]

export type RequestDataItem = AccountAddressRequest

export type RequestMethodInput = Partial<{
  accountAddresses: {}
}>

export type RequestMethodResponse = Partial<{
  [requestType.accountAddresses]: AccountAddressResponse['addresses']
}>
