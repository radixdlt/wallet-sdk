import loglevel from 'loglevel'
import { OutgoingMessage, OutgoingMessageType } from './_types'
import { err, ok, Result } from 'neverthrow'

type CreateMessageInput =
  | Omit<OutgoingMessage['request'], 'requestId'>
  | Omit<OutgoingMessage['sendTransaction'], 'requestId'>

export const createMessage = (
  input: CreateMessageInput
): Result<OutgoingMessageType, Error> => {
  try {
    const message = {
      ...input,
      requestId: crypto.randomUUID(),
    }
    loglevel.debug(`💬💫 message created\n${JSON.stringify(message)}`)
    return ok(message)
  } catch (error) {
    return err(error as Error)
  }
}
