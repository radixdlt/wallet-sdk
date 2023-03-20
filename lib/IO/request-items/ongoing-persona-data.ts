import {
  OngoingPersonaDataRequestItem,
  OngoingPersonaDataRequestResponseItem,
  PersonaData,
  PersonaDataField,
} from '../schemas'

export type OngoingPersonaData = {
  wallet: {
    request: OngoingPersonaDataRequestItem
    response: OngoingPersonaDataRequestResponseItem
  }
  method: {
    output: { ongoingPersonaData: PersonaData[] }
    input: { fields: PersonaDataField[] }
  }
}

type RequiredKeys =
  | { usePersona: any }
  | { loginWithoutChallenge: any }
  | { loginWithChallenge: any }

type NotAllowedKeys = { ongoingPersonaData: any }

export const ongoingPersonaData =
  (...fields: PersonaDataField[]) =>
  <I extends RequiredKeys>(input: I extends NotAllowedKeys ? never : I) => ({
    ...input,
    ongoingPersonaData: { fields },
  })
