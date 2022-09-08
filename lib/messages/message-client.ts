import { Subjects } from './subjects'
import { Subscriptions } from './subscriptions'
import { registerEventListeners } from './events/register-event-listeners'

export type MessageClientType = ReturnType<typeof MessageClient>

export const MessageClient = (subjects = Subjects()) => {
  const subscriptions = Subscriptions(subjects)
  const eventListeners = registerEventListeners(subjects)

  const destroy = () => {
    eventListeners.destroy()
    subscriptions.unsubscribe()
  }

  return { destroy, subjects }
}
