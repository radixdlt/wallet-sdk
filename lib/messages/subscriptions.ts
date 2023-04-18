import { Subjects } from './subjects'
import { Subscription } from 'rxjs'
import { sendWalletRequest } from './observables/send-wallet-request'
import { handleWalletResponse } from './observables/handle-wallet-response'
import { dispatchEvent } from './observables/dispatch-event'
import { AppLogger } from '../helpers/logger'

export const Subscriptions = (subjects: Subjects, logger?: AppLogger) => {
  const subscription = new Subscription()

  subscription.add(dispatchEvent(subjects, logger).subscribe())
  subscription.add(sendWalletRequest(subjects).subscribe())
  subscription.add(handleWalletResponse(subjects, logger).subscribe())

  return subscription
}
