export const requestType = {
  accountAddresses: 'accountAddresses',
  personaData: 'personaData',
} as const

export const requestTypeSet = new Set(Object.keys(requestType))

export type RequestTypes = keyof typeof requestType

export type RequestWalletResponse = {
  [requestType.accountAddresses]: {
    requestType: typeof requestType['accountAddresses']
    addresses: { label: string; address: string }[]
  }
  [requestType.personaData]: {
    requestType: typeof requestType['personaData']
    personaData: { field: string; value: string }[]
  }
}

export type RequestWalletResponseType = RequestWalletResponse[RequestTypes]

export type RequestItem =
  | {
      requestType: typeof requestType['accountAddresses']
      ongoing: boolean
      numberOfAddresses?: number
    }
  | {
      requestType: typeof requestType['personaData']
      ongoing: boolean
      fields: string[]
    }

export type RequestMethodInput = Partial<{
  accountAddresses: {
    numberOfAddresses?: number
    ongoing?: boolean
  }
  personaData: {
    fields: string[]
    ongoing?: boolean
  }
}>

export type RequestMethodResponse = Partial<{
  [requestType.accountAddresses]: RequestWalletResponse['accountAddresses']['addresses']
  [requestType.personaData]: RequestWalletResponse['personaData']['personaData']
}>
