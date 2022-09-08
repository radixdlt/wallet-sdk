import { IncomingMessageType } from '../_types'
import { SubjectsType } from '../subjects'
import { eventType } from './_types'

export const registerEventListeners = (subjects: SubjectsType) => {
  const handleIncomingMessage = (event: Event) => {
    const message = (event as CustomEvent<IncomingMessageType>).detail
    subjects.incomingMessageSubject.next(message)
  }

  addEventListener(eventType.incomingMessage, handleIncomingMessage)

  const destroy = () => {
    removeEventListener(eventType.incomingMessage, handleIncomingMessage)
  }

  return { destroy }
}
