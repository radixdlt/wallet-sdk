import { ok } from 'neverthrow'

export const createMessage = <T>(input: T, requestId = crypto.randomUUID()) =>
  ok({
    payload: input,
    requestId,
  })
