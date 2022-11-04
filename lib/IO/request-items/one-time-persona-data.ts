import { PersonaDataField } from './_types'

const oneTimePersonaDataRequestType = 'oneTimePersonaData'
type OneTimePersonaDataRequestType = typeof oneTimePersonaDataRequestType

export type OneTimePersonaData = {
  requestType: OneTimePersonaDataRequestType
  wallet: {
    request: {
      requestType: OneTimePersonaDataRequestType
    } & OneTimePersonaDataOutput
    response: {
      requestType: OneTimePersonaDataRequestType
      personaData: PersonaDataField[]
    }
  }
  method: {
    output: { oneTimePersonaData: PersonaDataField[] }
    input: OneTimePersonaDataOutput
  }
}

type OneTimePersonaDataOutput = ReturnType<
  ReturnType<typeof oneTimePersonaData>
>[OneTimePersonaDataRequestType]

export const oneTimePersonaData =
  (...fields: string[]) =>
  <I>(input: I extends { oneTimePersonaData: any } ? never : I) => ({
    ...input,
    oneTimePersonaData: { fields },
  })
