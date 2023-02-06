import {
  AuthLoginRequestItem,
  AuthLoginWithChallengeRequestResponseItem,
  AuthLoginWithoutChallengeRequestResponseItem,
  Persona,
} from '../schemas'

export type Login = {
  WithoutChallenge: {
    wallet: {
      request: AuthLoginRequestItem
      response: AuthLoginWithoutChallengeRequestResponseItem
    }
    method: {
      input: {}
      output: {
        persona: Persona
      }
    }
  }
  WithChallenge: {
    wallet: {
      request: AuthLoginRequestItem
      response: AuthLoginWithChallengeRequestResponseItem
    }
    method: {
      output: {
        persona: Persona
        signedChallenge: {
          challenge: string
          publicKey: string
          signature: string
        }
      }
      input: { challenge: string }
    }
  }
}

type NotAllowedKeys = Partial<{
  persona: any
  loginWithoutChallenge: any
  loginWithChallenge: any
}>

export const login = {
  withoutChallenge:
    () =>
    <I>(input: I extends NotAllowedKeys ? never : I) => ({
      ...input,
      loginWithoutChallenge: {
        discriminator: 'login',
      },
    }),
  withChallenge:
    (challenge: string) =>
    <I>(input: I extends NotAllowedKeys ? never : I) => ({
      ...input,
      loginWithChallenge: { discriminator: 'login', challenge },
    }),
}
