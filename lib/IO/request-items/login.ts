import {
  AuthLoginWithChallengeRequestItem,
  AuthLoginWithoutChallengeRequestItem,
  AuthLoginWithChallengeRequestResponseItem,
  AuthLoginWithoutChallengeRequestResponseItem,
  Persona,
} from '../schemas'

export type Login = {
  WithoutChallenge: {
    wallet: {
      request: AuthLoginWithoutChallengeRequestItem
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
      request: AuthLoginWithChallengeRequestItem
      response: AuthLoginWithChallengeRequestResponseItem
    }
    method: {
      output: {
        persona: Persona
        challenge: string
        proof: {
          curve: string
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
        discriminator: 'loginWithoutChallenge',
      },
    }),
  withChallenge:
    (challenge: string) =>
    <I>(input: I extends NotAllowedKeys ? never : I) => ({
      ...input,
      loginWithChallenge: { discriminator: 'loginWithChallenge', challenge },
    }),
}
