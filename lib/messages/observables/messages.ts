import { SubjectsType } from '../subjects'
import log from 'loglevel'
import { tap, share, map } from 'rxjs'
import { alphaBridge } from '../../extension/alpha-bridge'

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
    map(alphaBridge.transformIncomingMessage),
    tap((message) => {
      log.debug(`⬇️ received message\n${JSON.stringify(message, null, 2)}`)
      if (message.method) {
        subjects.responseSubject.next(message)
      }
    })
  )
