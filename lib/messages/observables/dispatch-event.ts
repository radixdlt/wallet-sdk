import { SubjectsType } from '../subjects'
import { tap } from 'rxjs'
import log from 'loglevel'

export const dispatchEvent = (subjects: SubjectsType) =>
  subjects.dispatchEventSubject.pipe(
    tap(({ event, payload }) => {
      log.debug(`🔵💬⬆️ message sent\n${JSON.stringify(payload)}`)
      window.dispatchEvent(
        new CustomEvent(event, {
          detail: payload,
        })
      )
    })
  )
