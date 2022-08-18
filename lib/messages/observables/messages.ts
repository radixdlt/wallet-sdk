import { SubjectsType } from '../subjects'
import log from 'loglevel'
import { tap, share } from 'rxjs'

export const outgoingMessage = (subjects: SubjectsType) =>
  subjects.outgoingMessageSubject.pipe(
    tap((message) => {
      subjects.dispatchEventSubject.next({
        event: 'radix#chromeExtension#send',
        message,
      })
    }),
    share()
  )

export const incomingMessage = (subjects: SubjectsType) =>
  subjects.incomingMessageSubject.pipe(
    tap((message) => {
      log.debug(`⬇️ received message\n${JSON.stringify(message)}`)
      if (message.method) {
        subjects.responseSubject.next(message)
      }
    })
  )
