const loginRequestType = 'login'
type LoginRequestType = typeof loginRequestType

export type LoginResponse = {
  personaId: string
}

export type Login = {
  requestType: LoginRequestType
  wallet: {
    request: {
      requestType: LoginRequestType
    } & LoginOutput
    response: {
      requestType: LoginRequestType
    } & LoginResponse
  }
  method: {
    output: {
      login: LoginResponse
    }
    input: LoginOutput
  }
}

type LoginOutput = ReturnType<ReturnType<typeof login>>[LoginRequestType]

export const login =
  () =>
  <I>(
    input: I extends
      | { persona: { id: string } }
      | { login: any }
      | { loginWithChallenge: any }
      ? never
      : I
  ) => ({
    ...input,
    login: {},
  })

const loginWithChallengeRequestType = 'loginWithChallenge'
type LoginWithChallengeRequestType = typeof loginWithChallengeRequestType

export type LoginResponseWithChallenge = LoginResponse & {
  challenge: string
  publicKey: string
  identityComponentAddress: string
  signature: string
}

export type LoginWithChallenge = {
  requestType: LoginWithChallengeRequestType
  wallet: {
    request: {
      requestType: LoginRequestType
      challenge: string
    }
    response: {
      requestType: LoginRequestType
    } & LoginResponseWithChallenge
  }
  method: {
    output: { login: LoginResponseWithChallenge }
    input: LoginWithChallengeOutput
  }
}

type LoginWithChallengeOutput = ReturnType<
  ReturnType<typeof loginWithChallenge>
>[LoginWithChallengeRequestType]

export const loginWithChallenge =
  (challenge: string) =>
  <I>(
    input: I extends
      | { persona: { id: string } }
      | { login: any }
      | { loginWithChallenge: any }
      ? never
      : I
  ) => ({
    ...input,
    loginWithChallenge: {
      challenge,
    },
  })
