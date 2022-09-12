import loglevel from 'loglevel'
import { OutgoingMessage, OutgoingMessageType } from './_types'
import { ok, Result } from 'neverthrow'

type CreateMessageInput =
  | Omit<OutgoingMessage['request'], 'requestId'>
  | Omit<OutgoingMessage['sendTransaction'], 'requestId'>

export const createMessage = (
  input: CreateMessageInput,
  requestId = crypto.randomUUID()
): Result<OutgoingMessageType, never> =>
  ok({
    ...input,
    requestId,
  }).map((message) => {
    loglevel.debug(`🔵💬💫 message created\n${JSON.stringify(message)}`)
    return message
  })
