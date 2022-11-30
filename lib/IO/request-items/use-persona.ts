import { UsePersonaReadRequestItem, UsePersonaResponseItem } from '../schemas'

export type UsePersona = {
  wallet: {
    request: UsePersonaReadRequestItem
    response: UsePersonaResponseItem
  }
  method: {
    output: { persona: { id: string } }
    input: { id: string }
  }
}

type NotAllowedKeys = Partial<{ login: any; usePersona: any }>

export const usePersona =
  (id: string) =>
  <I>(input: I extends NotAllowedKeys ? never : I) => ({
    ...input,
    usePersona: { id },
  })
