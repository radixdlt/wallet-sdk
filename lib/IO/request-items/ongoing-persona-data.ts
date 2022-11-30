import {
  OngoingPersonaDataReadRequestItem,
  OngoingPersonaDataResponseItem,
  PersonaDataField,
} from '../schemas'

export type OngoingPersonaData = {
  wallet: {
    request: OngoingPersonaDataReadRequestItem
    response: OngoingPersonaDataResponseItem
  }
  method: {
    output: { ongoingPersonaData: PersonaDataField[] }
    input: { fields: string[] }
  }
}

type RequiredKeys =
  | { persona: any }
  | { loginWithoutChallenge: any }
  | { loginWithChallenge: any }

type NotAllowedKeys = { ongoingPersonaData: any }

export const ongoingPersonaData =
  (...fields: string[]) =>
  <I extends RequiredKeys>(input: I extends NotAllowedKeys ? never : I) => ({
    ...input,
    ongoingPersonaData: { fields },
  })
