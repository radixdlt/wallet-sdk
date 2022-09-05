export const requestType = {
  accountAddress: 'accountAddress',
} as const

export type RequestTypes = keyof typeof requestType

export type AccountAddress = typeof requestType['accountAddress']

export type AccountAddressRequest = {
  requestType: AccountAddress
}

export type AccountAddressWalletResponse = {
  requestType: AccountAddress
  addresses: string[]
}

export type RequestItem = AccountAddressRequest
export type Request = RequestItem[]

export type RequestResponse = {
  accountAddress: AccountAddressWalletResponse['addresses']
}

export type WalletResponses = {
   RequestWallet: AccountAddressWalletResponse[]
}

export type RequestDataInput = Partial<{
  accountAddress: Omit<AccountAddressRequest, 'requestType'>
}>