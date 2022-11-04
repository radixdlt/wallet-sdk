import { Login, LoginWithChallenge } from '../IO/request-items/login'
import {
  OneTimeAccountAddresses,
  OneTimeAccountAddressesWithProofOfOwnership,
} from '../IO/request-items/one-time-account-addresses'
import { OneTimePersonaData } from '../IO/request-items/one-time-persona-data'
import {
  OngoingAccountAddresses,
  OngoingAccountAddressesWithProofOfOwnership,
} from '../IO/request-items/ongoing-account-addresses'
import { OngoingPersonaData } from '../IO/request-items/ongoing-time-persona-data'
import { Persona } from '../IO/request-items/persona'

export const requestMethodRequestType = {
  persona: 'persona',
  oneTimeAccountAddresses: 'oneTimeAccountAddresses',
  oneTimeAccountAddressesWithProofOfOwnership:
    'oneTimeAccountAddressesWithProofOfOwnership',
  ongoingAccountAddresses: 'ongoingAccountAddresses',
  ongoingAccountAddressesWithProofOfOwnership:
    'ongoingAccountAddressesWithProofOfOwnership',
  login: 'login',
  loginWithChallenge: 'loginWithChallenge',
  oneTimePersonaData: 'oneTimePersonaData',
  ongoingPersonaData: 'ongoingPersonaData',
} as const

type RequestMethodRequestTypes = keyof typeof requestMethodRequestType

type RequestItems = {
  [requestMethodRequestType.persona]: Persona
  [requestMethodRequestType.oneTimeAccountAddresses]: OneTimeAccountAddresses
  [requestMethodRequestType.oneTimeAccountAddressesWithProofOfOwnership]: OneTimeAccountAddressesWithProofOfOwnership
  [requestMethodRequestType.ongoingAccountAddresses]: OngoingAccountAddresses
  [requestMethodRequestType.ongoingAccountAddressesWithProofOfOwnership]: OngoingAccountAddressesWithProofOfOwnership
  [requestMethodRequestType.login]: Login
  [requestMethodRequestType.loginWithChallenge]: LoginWithChallenge
  [requestMethodRequestType.oneTimePersonaData]: OneTimePersonaData
  [requestMethodRequestType.ongoingPersonaData]: OngoingPersonaData
}

export type RequestMethod = {
  requestTypes: RequestMethodRequestTypes
  wallet: {
    request: RequestItems[RequestMethodRequestTypes]['wallet']['request']
    response: {
      [Key in RequestMethodRequestTypes]: RequestItems[Key]['wallet']['response']
    }[RequestMethodRequestTypes]
  }
  method: {
    input: Partial<{
      [Key in keyof RequestItems]: RequestItems[Key]['method']['input']
    }>
    output: {
      [Key in RequestMethodRequestTypes]: RequestItems[Key]['method']['output']
    }
  }
}
