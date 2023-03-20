import {
  OneTimePersonaDataRequestItem,
  OneTimePersonaDataRequestResponseItem,
  PersonaDataField,
} from '../schemas'

export type OneTimePersonaData = {
  wallet: {
    request: OneTimePersonaDataRequestItem
    response: OneTimePersonaDataRequestResponseItem
  }
  method: {
    output: {
      oneTimePersonaData: OneTimePersonaDataRequestResponseItem['fields']
    }
    input: { fields: PersonaDataField[] }
  }
}

type NotAllowedKeys = { oneTimePersonaData: any }

export const oneTimePersonaData =
  (...fields: PersonaDataField[]) =>
  <I>(input: I extends NotAllowedKeys ? never : I) => ({
    ...input,
    oneTimePersonaData: { fields },
  })
