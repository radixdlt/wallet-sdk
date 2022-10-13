export const requestType = {
  accountAddresses: 'accountAddresses',
  personaData: 'personaData',
} as const

export const requestTypeSet = new Set(Object.keys(requestType))

export type RequestTypes = keyof typeof requestType

type AccountAddressesRequestMethodInput = {
  numberOfAddresses?: number
  ongoing?: boolean
  reset?: boolean
}

type PersonaDataRequestMethodInput = {
  fields: string[]
  ongoing?: boolean
  reset?: boolean
  revokeOngoingAccess?: string[]
}

export type RequestMethodInput = Partial<{
  [requestType.accountAddresses]: AccountAddressesRequestMethodInput
  [requestType.personaData]: PersonaDataRequestMethodInput
}>

type AccountAddressesWalletRequestItem = {
  requestType: typeof requestType['accountAddresses']
  ongoing: boolean
  numberOfAddresses?: number
  reset: boolean
}

type PersonaDataWalletRequestItem = {
  requestType: typeof requestType['personaData']
  ongoing: boolean
  fields: string[]
  reset: boolean
  revokeOngoingAccess?: string[]
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

export type RequestWalletResponse = {
  [requestType.accountAddresses]: AccountAddressesRequestWalletResponse
  [requestType.personaData]: PersonaDataRequestWalletResponse
}

export type RequestWalletResponseType = RequestWalletResponse[RequestTypes]

export type RequestMethodResponse = Partial<{
  [requestType.accountAddresses]: RequestWalletResponse['accountAddresses']['addresses']
  [requestType.personaData]: RequestWalletResponse['personaData']['personaData']
}>
