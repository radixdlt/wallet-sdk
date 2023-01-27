import { Login } from '../IO/request-items/login'
import { OneTimeAccounts } from '../IO/request-items/one-time-accounts'
import { OneTimePersonaData } from '../IO/request-items/one-time-persona-data'
import { OngoingAccounts } from '../IO/request-items/ongoing-accounts'
import { OngoingPersonaData } from '../IO/request-items/ongoing-persona-data'
import { UsePersona } from '../IO/request-items/use-persona'

export const requestMethodRequestType = {
  oneTimeAccountsWithoutProofOfOwnership:
    'oneTimeAccountsWithoutProofOfOwnership',
  oneTimeAccountsWithProofOfOwnership: 'oneTimeAccountsWithProofOfOwnership',
  ongoingAccountsWithoutProofOfOwnership:
    'ongoingAccountsWithoutProofOfOwnership',
  ongoingAccountsWithProofOfOwnership: 'ongoingAccountsWithProofOfOwnership',
  usePersona: 'usePersona',
  loginWithoutChallenge: 'loginWithoutChallenge',
  loginWithChallenge: 'loginWithChallenge',
  login: 'login',
  oneTimePersonaData: 'oneTimePersonaData',
  ongoingPersonaData: 'ongoingPersonaData',
} as const

type RequestItems = {
  [requestMethodRequestType.oneTimeAccountsWithoutProofOfOwnership]: OneTimeAccounts['WithoutProofOfOwnership']
  [requestMethodRequestType.oneTimeAccountsWithProofOfOwnership]: OneTimeAccounts['WithProofOfOwnership']
  [requestMethodRequestType.ongoingAccountsWithoutProofOfOwnership]: OngoingAccounts['WithoutProofOfOwnership']
  [requestMethodRequestType.ongoingAccountsWithProofOfOwnership]: OngoingAccounts['WithProofOfOwnership']
  [requestMethodRequestType.usePersona]: UsePersona
  [requestMethodRequestType.loginWithoutChallenge]: Login['WithoutChallenge']
  [requestMethodRequestType.loginWithChallenge]: Login['WithChallenge']
  [requestMethodRequestType.login]: Login['WithoutChallenge']
  [requestMethodRequestType.oneTimePersonaData]: OneTimePersonaData
  [requestMethodRequestType.ongoingPersonaData]: OngoingPersonaData
}

type RequestMethodRequestTypes = keyof RequestItems

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
