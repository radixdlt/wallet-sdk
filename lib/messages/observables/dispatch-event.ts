import { SubjectsType } from '../subjects'
import { map, tap } from 'rxjs'
import log from 'loglevel'
import { alphaBridge } from '../../extension/alpha-bridge'

export const dispatchEvent = (subjects: SubjectsType) =>
  subjects.dispatchEventSubject.pipe(
    map(alphaBridge.transformOutgoingMessage),
    tap(({ event, payload }) => {
      log.debug(`🚀 event dispatched: '${event}'\n${JSON.stringify(payload)}`)
      window.dispatchEvent(
        new CustomEvent(event, {
          detail: payload,
        })
      )
    })
  )
