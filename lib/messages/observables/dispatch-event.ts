import { SubjectsType } from '../subjects'
import { map, tap } from 'rxjs'
import log from 'loglevel'
import { config } from '../../config'
import { alphaBridge } from '../../extension/alpha-bridge'

export const dispatchEvent = (subjects: SubjectsType) =>
  subjects.dispatchEventSubject.pipe(
    map((input) =>
      config.walletExtension
        ? alphaBridge.transformOutgoingMessage(input)
        : input
    ),
    tap(({ event, payload }) => {
      log.debug(`🔵💬⬆️ message sent\n${JSON.stringify(payload)}`)
      window.dispatchEvent(
        new CustomEvent(event, {
          detail: payload,
        })
      )
    })
  )
