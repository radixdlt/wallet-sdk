export const personaRequestType = 'persona'

export type Persona = {
  requestType: 'persona'
  wallet: {
    request: {
      requestType: 'persona'
    } & PersonaOutput
    response: {
      requestType: 'persona'
      persona: {
        id: string
      }
    }
  }
  method: {
    output: { persona: PersonaOutput }
    input: { id: string }
  }
}

type PersonaOutput = ReturnType<ReturnType<typeof usePersona>>['persona']
export const usePersona =
  (id: string) =>
  <I>(input: I extends { login: any } | { persona: any } ? never : I) => ({
    ...input,
    persona: { id },
  })
