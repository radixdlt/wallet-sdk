import {
  AuthUsePersonaRequestItem,
  AuthUsePersonaRequestResponseItem,
} from '../schemas'

export type UsePersona = {
  wallet: {
    request: AuthUsePersonaRequestItem
    response: AuthUsePersonaRequestResponseItem
  }
  method: {
    input: { identityAddress: string }
    output: {
      auth: { identityAddress: string }
    }
  }
}

type NotAllowedKeys = Partial<{ login: any; usePersona: any }>

export const usePersona =
  (identityAddress: string) =>
  <I>(input: I extends NotAllowedKeys ? never : I) => ({
    ...input,
    usePersona: { discriminator: 'usePersona', identityAddress },
  })
