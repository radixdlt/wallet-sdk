import { Subjects } from '../subjects'
import { tap, share, map } from 'rxjs'
import { eventType } from '../events/_types'

export const sendWalletRequest = (subjects: Subjects) =>
  subjects.outgoingMessageSubject.pipe(
    map((payload) => ({
      event: eventType.outgoingMessage,
      payload,
    })),
    tap((payload) => {
      subjects.dispatchEventSubject.next(payload)
    }),
    share()
  )
