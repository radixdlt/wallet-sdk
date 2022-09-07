import { SubjectsType } from '../subjects'
import { map, tap } from 'rxjs'
import log from 'loglevel'
import { alphaBridge } from '../../extension/alpha-bridge'
import { config } from '../../config'

export const dispatchEvent = (subjects: SubjectsType) =>
  subjects.dispatchEventSubject.pipe(
    map((input) =>
      config.alphaWallet ? alphaBridge.transformOutgoingMessage(input) : input
    ),
    tap(({ event, payload }) => {
      log.debug(
        `💬🚀 message dispatched: '${event}'\n${JSON.stringify(payload)}`
      )
      window.dispatchEvent(
        new CustomEvent(event, {
          detail: payload,
        })
      )
    })
  )
