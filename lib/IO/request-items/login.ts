import { LoginReadRequestItem, LoginResponseItem } from '../schemas'

export type Login = {
  WithoutChallenge: {
    wallet: {
      request: LoginReadRequestItem
      response: LoginResponseItem
    }
    method: {
      input: {}
      output: {
        login: { personaId: string }
      }
    }
  }
  WithChallenge: {
    wallet: {
      request: LoginReadRequestItem
      response: LoginResponseItem
    }
    method: {
      output: {
        login: {
          challenge: string
          personaId: string
          publicKey: string
          signature: string
          identityComponentAddress: string
        }
      }
      input: { challenge: string }
    }
  }
}

type NotAllowedKeys = Partial<{
  usePersona: any
  login: any
}>

export const login =
  (challenge?: string) =>
  <I>(input: I extends NotAllowedKeys ? never : I) => ({
    ...input,
    login: { challenge },
  })
