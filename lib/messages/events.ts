import loglevel from 'loglevel'
import { IncomingMessageType } from './_types'
import { SubjectsType } from './subjects'

export const OUTGOING_MESSAGE_EVENT = 'radix#chromeExtension#send'
export const INCOMING_MESSAGE_EVENT = 'radix#chromeExtension#receive'

export type OutgoingMessageEvent = typeof INCOMING_MESSAGE_EVENT
export type IncomingMessageEvent = typeof OUTGOING_MESSAGE_EVENT

export type EventType = OutgoingMessageEvent | IncomingMessageEvent

export const registerEventListeners = (subjects: SubjectsType) => {
  loglevel.debug(`🦻 event listeners registered`)
  const handleIncomingMessage = (event: Event) => {
    const message = (event as CustomEvent<IncomingMessageType>).detail
    subjects.incomingMessageSubject.next(message)
  }

  addEventListener(INCOMING_MESSAGE_EVENT, handleIncomingMessage)

  const destroy = () => {
    removeEventListener(INCOMING_MESSAGE_EVENT, handleIncomingMessage)
  }

  return { destroy }
}
