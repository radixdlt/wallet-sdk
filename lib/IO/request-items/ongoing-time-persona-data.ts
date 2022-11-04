import { PersonaDataField } from './_types'

const ongoingPersonaDataRequestType = 'ongoingPersonaData'
type OngoingPersonaDataRequestType = typeof ongoingPersonaDataRequestType

export type OngoingPersonaData = {
  requestType: OngoingPersonaDataRequestType
  wallet: {
    request: {
      requestType: OngoingPersonaDataRequestType
    } & OngoingPersonaDataOutput
    response: {
      requestType: OngoingPersonaDataRequestType
      personaData: PersonaDataField[]
    }
  }
  method: {
    output: { ongoingPersonaData: PersonaDataField[] }
    input: OngoingPersonaDataOutput
  }
}

type OngoingPersonaDataOutput = ReturnType<
  ReturnType<typeof ongoingPersonaData>
>[OngoingPersonaDataRequestType]

export const ongoingPersonaData =
  (...fields: string[]) =>
  <I extends { persona: any } | { login: any } | { loginWithChallenge: any }>(
    input: I extends { ongoingPersonaDataRequestType: any } ? never : I
  ) => ({
    ...input,
    ongoingPersonaData: { fields },
  })
