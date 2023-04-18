import { tap } from 'rxjs'
import { AppLogger } from '../../helpers/logger'
import { Subjects } from '../subjects'

export const dispatchEvent = (subjects: Subjects, logger?: AppLogger) =>
  subjects.dispatchEventSubject.pipe(
    tap(({ event, payload }) => {
      logger?.debug(`🔵⬆️ walletRequest`, payload)
      window.dispatchEvent(
        new CustomEvent(event, {
          detail: payload,
        })
      )
    })
  )
