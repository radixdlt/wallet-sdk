import { AppLogger } from '../../helpers/logger'
import { Subjects } from '../subjects'
import { tap } from 'rxjs'

export const handleWalletResponse = (subjects: Subjects, logger?: AppLogger) =>
  subjects.incomingMessageSubject.pipe(
    tap((message) => {
      if ('eventType' in message) {
        logger?.debug(`🔵💬⬇️ messageLifecycleEvent`, message)
        subjects.messageLifeCycleEventSubject.next(message)
      } else {
        logger?.debug(`🔵⬇️ walletResponse`, message)
        subjects.responseSubject.next(message)
      }
    })
  )
