import { OutgoingMessage } from '../_types'
import { SubjectsType } from '../subjects'
import { tap } from 'rxjs'
import log from 'loglevel'

export const dispatchEvent = (subjects: SubjectsType) =>
  subjects.dispatchEventSubject.pipe(
    tap(({ event, message }) => {
      log.debug(`🚀 event dispatched: '${event}'\n${JSON.stringify(message)}`)
      window.dispatchEvent(
        new CustomEvent<OutgoingMessage>(event, {
          detail: message,
        })
      )
    })
  )
