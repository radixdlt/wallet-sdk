import { SubjectsType } from '../subjects'
import log from 'loglevel'
import { tap, share, map } from 'rxjs'
import { alphaBridge } from '../../extension/alpha-bridge'
import { config } from '../../config'

export const outgoingMessage = (subjects: SubjectsType) =>
  subjects.outgoingMessageSubject.pipe(
    tap((payload) => {
      subjects.dispatchEventSubject.next({
        event: 'radix#chromeExtension#send',
        payload,
      })
    }),
    share()
  )

export const incomingMessage = (subjects: SubjectsType) =>
  subjects.incomingMessageSubject.pipe(
    map((message) =>
      config.alphaWallet
        ? alphaBridge.transformIncomingMessage(message)
        : message
    ),
    tap((message) => {
      log.debug(`💬⬇️ message received\n${JSON.stringify(message)}`)
      return subjects.responseSubject.next(message)
    })
  )
