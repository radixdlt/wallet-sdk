import { SubjectsType } from '../subjects'
import log from 'loglevel'
import { tap, share, map } from 'rxjs'
import { alphaBridge } from '../../extension/alpha-bridge'
import { config } from '../../config'
import { eventType } from '../events/_types'

export const outgoingMessage = (subjects: SubjectsType) =>
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

export const incomingMessage = (subjects: SubjectsType) =>
  subjects.incomingMessageSubject.pipe(
    map((message) =>
      config.alphaWallet
        ? alphaBridge.transformIncomingMessage(message)
        : message
    ),
    tap((message) => {
      log.debug(`🔵💬⬇️ message received\n${JSON.stringify(message)}`)
      if ('eventType' in message) {
        subjects.messageLifeCycleEventSubject.next(message)
      } else {
        subjects.responseSubject.next(message)
      }
    })
  )
