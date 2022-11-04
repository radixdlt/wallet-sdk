import { SubjectsType } from '../subjects'
import log from 'loglevel'
import { tap } from 'rxjs'

export const walletResponse = (subjects: SubjectsType) =>
  subjects.incomingMessageSubject.pipe(
    tap((message) => {
      if ('eventType' in message) {
        log.debug(
          `🔵💬⬇️ message lifecycle event\n${JSON.stringify(message, null, 2)}`
        )
        subjects.messageLifeCycleEventSubject.next(message)
      } else {
        log.debug(`🔵⬇️ wallet response\n${JSON.stringify(message, null, 2)}`)
        subjects.responseSubject.next(message)
      }
    })
  )
