import { SubjectsType } from '../subjects'
import { tap, share, map } from 'rxjs'
import { eventType } from '../events/_types'

export const walletRequest = (subjects: SubjectsType) =>
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
