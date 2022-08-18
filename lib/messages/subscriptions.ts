import { SubjectsType } from './subjects'
import { Subscription } from 'rxjs'
import { outgoingMessage, incomingMessage } from './observables/messages'
import { dispatchEvent } from './observables/dispatch-event'

export const Subscriptions = (subjects: SubjectsType) => {
  const subscription = new Subscription()

  subscription.add(dispatchEvent(subjects).subscribe())
  subscription.add(incomingMessage(subjects).subscribe())
  subscription.add(outgoingMessage(subjects).subscribe())

  return subscription
}
