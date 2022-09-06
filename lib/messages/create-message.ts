import loglevel from 'loglevel'
import { Message, OutgoingMessage } from './_types'
import { Request, SendTransaction } from '../methods'
import { err, ok, Result } from 'neverthrow'

type CreateMessageInput =
  | Omit<Message<'request', Request>, 'requestId'>
  | Omit<Message<'sendTransaction', SendTransaction>, 'requestId'>

export const createMessage = (
  value: CreateMessageInput
): Result<OutgoingMessage, Error> => {
  try {
    const message = {
      ...value,
      requestId: crypto.randomUUID(),
    }
    loglevel.debug(`💬💫 message created\n${JSON.stringify(message)}`)
    return ok(message)
  } catch (error) {
    return err(error as Error)
  }
}
