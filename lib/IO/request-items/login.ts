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
      output: { login: { personaId: string } }
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
      loginWithoutChallenge: {},
    }),
  withChallenge:
    (challenge: string) =>
    <I>(input: I extends NotAllowedKeys ? never : I) => ({
      ...input,
      loginWithChallenge: { challenge },
    }),
}
