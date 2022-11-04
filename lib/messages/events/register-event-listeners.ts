import { SubjectsType } from '../subjects'
import { IncomingMessage } from '../_types'
import { eventType } from './_types'

export const registerEventListeners = (subjects: SubjectsType) => {
  const handleIncomingMessage = (event: Event) => {
    const message = (
      event as CustomEvent<
        IncomingMessage['event'] | IncomingMessage['response']
      >
    ).detail
    subjects.incomingMessageSubject.next(message)
  }

  addEventListener(eventType.incomingMessage, handleIncomingMessage)

  const destroy = () => {
    removeEventListener(eventType.incomingMessage, handleIncomingMessage)
  }

  return { destroy }
}
