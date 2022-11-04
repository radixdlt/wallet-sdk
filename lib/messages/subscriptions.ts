import { SubjectsType } from './subjects'
import { Subscription } from 'rxjs'
import { walletRequest } from './observables/wallet-request'
import { walletResponse } from './observables/wallet-response'
import { dispatchEvent } from './observables/dispatch-event'

export const Subscriptions = (subjects: SubjectsType) => {
  const subscription = new Subscription()

  subscription.add(dispatchEvent(subjects).subscribe())
  subscription.add(walletRequest(subjects).subscribe())
  subscription.add(walletResponse(subjects).subscribe())

  return subscription
}
