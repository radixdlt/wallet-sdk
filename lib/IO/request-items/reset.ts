import { ResetRequestItem } from '../schemas'

export type Reset = {
  wallet: {
    request: ResetRequestItem
    response: {}
  }
  method: {
    input: Partial<ResetRequestItem>
    output: {}
  }
}

type RequiredKeys =
  | { usePersona: any }
  | { login: any }
  | { loginWithoutChallenge: any }

type NotAllowedKeys = Partial<{ reset: any }>

export const reset =
  ({ accounts = false, personaData = false }: Partial<ResetRequestItem>) =>
  <I extends RequiredKeys>(input: I extends NotAllowedKeys ? never : I) => ({
    ...input,
    reset: { accounts, personaData },
  })
