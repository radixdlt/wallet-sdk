import { Subjects } from './subjects'
import { Subscription } from 'rxjs'
import { sendWalletRequest } from './observables/send-wallet-request'
import { handleWalletResponse } from './observables/handle-wallet-response'
import { AppLogger } from '../helpers/logger'

export const Subscriptions = (subjects: Subjects, logger?: AppLogger) => {
  const subscription = new Subscription()

  subscription.add(sendWalletRequest(subjects, logger).subscribe())
  subscription.add(handleWalletResponse(subjects, logger).subscribe())

  return subscription
}
