import {
  OneTimePersonaDataReadRequestItem,
  OneTimePersonaDataResponseItem,
} from '../schemas'

export type OneTimePersonaData = {
  wallet: {
    request: OneTimePersonaDataReadRequestItem
    response: OneTimePersonaDataResponseItem
  }
  method: {
    output: { oneTimePersonaData: OneTimePersonaDataResponseItem['fields'] }
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
