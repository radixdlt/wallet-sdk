import {
  OneTimePersonaDataRequestItem,
  OneTimePersonaDataRequestResponseItem,
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
    input: { fields: string[] }
  }
}

type NotAllowedKeys = { oneTimePersonaData: any }

export const oneTimePersonaData =
  (...fields: string[]) =>
  <I>(input: I extends NotAllowedKeys ? never : I) => ({
    ...input,
    oneTimePersonaData: { fields },
  })
