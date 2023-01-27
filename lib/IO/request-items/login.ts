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
        auth: {
          identityAddress: string
        }
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
        auth: {
          challenge: string
          persona: Persona
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
