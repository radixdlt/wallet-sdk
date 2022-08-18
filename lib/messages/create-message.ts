import loglevel from 'loglevel'
import { Message, OutgoingMessage } from './_types'
import { Request, Transaction } from '../methods'

type CreateMessageInput =
  | Omit<Message<'request', Request>, 'requestId'>
  | Omit<Message<'transaction', Transaction>, 'requestId'>

export const createMessage = (value: CreateMessageInput): OutgoingMessage => {
  const message = {
    ...value,
    requestId: crypto.randomUUID(),
  }
  loglevel.debug(`💬 message created\n${JSON.stringify(message)}`)
  return message
}
