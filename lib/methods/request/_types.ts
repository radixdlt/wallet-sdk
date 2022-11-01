export const requestType = {
  accountAddresses: 'accountAddresses',
  personaData: 'personaData',
  login: 'login',
} as const

export const requestTypeSet = new Set(Object.keys(requestType))

export type RequestTypes = keyof typeof requestType

type AccountAddressesRequestMethodInput = {
  numberOfAddresses?: number
}

type PersonaDataRequestMethodInput = {
  fields: string[]
}

type LoginRequestMethodInput = {
  challenge: string
}

export type RequestMethodInput = Partial<{
  [requestType.accountAddresses]: AccountAddressesRequestMethodInput
  [requestType.personaData]: PersonaDataRequestMethodInput
  [requestType.login]: LoginRequestMethodInput
}>

type AccountAddressesWalletRequestItem = {
  requestType: typeof requestType['accountAddresses']
  ongoing: boolean
  numberOfAddresses?: number
}

type PersonaDataWalletRequestItem = {
  requestType: typeof requestType['personaData']
  fields: string[]
}

export type WalletRequestItem =
  | AccountAddressesWalletRequestItem
  | PersonaDataWalletRequestItem

type AccountAddressesRequestWalletResponse = {
  requestType: typeof requestType['accountAddresses']
  addresses: { label: string; address: string }[]
}

type PersonaDataRequestWalletResponse = {
  requestType: typeof requestType['personaData']
  personaData: { field: string; value: string }[]
}

type LoginRequestWalletResponse = {
  requestType: typeof requestType['login']
  challenge: string
  signature: string
  publicKey: string
  identityComponentAddress: string
}

export type RequestWalletResponse = {
  [requestType.accountAddresses]: AccountAddressesRequestWalletResponse
  [requestType.personaData]: PersonaDataRequestWalletResponse
  [requestType.login]: LoginRequestWalletResponse
}

export type RequestWalletResponseType = RequestWalletResponse[RequestTypes]

export type RequestMethodResponse = Partial<{
  [requestType.accountAddresses]: RequestWalletResponse['accountAddresses']['addresses']
  [requestType.personaData]: RequestWalletResponse['personaData']['personaData']
  [requestType.login]: {
    challenge: string
    signature: string
    publicKey: string
    identityComponentAddress: string
  }
}>
