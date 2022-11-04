import { SubjectsType } from '../subjects'
import { tap } from 'rxjs'
import log from 'loglevel'

export const dispatchEvent = (subjects: SubjectsType) =>
  subjects.dispatchEventSubject.pipe(
    tap(({ event, payload }) => {
      log.debug(`🔵⬆️ wallet request\n${JSON.stringify(payload, null, 2)}`)
      window.dispatchEvent(
        new CustomEvent(event, {
          detail: payload,
        })
      )
    })
  )
