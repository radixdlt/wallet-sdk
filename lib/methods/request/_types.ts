export const requestType = {
  accountAddress: 'accountAddress',
  personaData: 'personaData',
} as const

export type RequestTypes = keyof typeof requestType

export type AccountAddress = typeof requestType['accountAddress']

export type AccountAddressRequest = {
  requestType: AccountAddress
  numberOfAddresses: number | 'any'
  ongoing: boolean
}

export type PersonaData = typeof requestType['personaData']

export type PersonaDataRequest = {
  requestType: PersonaData
  dataFields: string[]
  ongoing: boolean
}

export type AccountAddressWalletResponse = {
  requestType: AccountAddress
  addresses: string[]
}

export type PersonaDataWalletResponse = {
  requestType: PersonaData
  dataFields: string[]
}

export type RequestItem = AccountAddressRequest | PersonaDataRequest
export type Request = RequestItem[]

export type RequestWalletResponse = {
  method: 'request'
  data: (AccountAddressWalletResponse | PersonaDataWalletResponse)[]
}

export type RequestResponse = {
  accountAddress: AccountAddressWalletResponse['addresses']
  personaData: PersonaDataWalletResponse['dataFields']
}

export type WalletResponses = RequestWalletResponse
