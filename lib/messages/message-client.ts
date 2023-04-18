import { Subjects } from './subjects'
import { Subscriptions } from './subscriptions'
import { registerEventListeners } from './events/register-event-listeners'
import { AppLogger } from '../helpers/logger'

export type MessageClient = ReturnType<typeof MessageClient>

export const MessageClient = (subjects: Subjects, logger?: AppLogger) => {
  const subscriptions = Subscriptions(subjects, logger)
  const eventListeners = registerEventListeners(subjects)

  const destroy = () => {
    eventListeners.destroy()
    subscriptions.unsubscribe()
  }

  return { destroy, subjects }
}
