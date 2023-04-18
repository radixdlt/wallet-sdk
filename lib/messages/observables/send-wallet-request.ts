import { Subjects } from '../subjects'
import { tap } from 'rxjs'
import { eventType } from '../events/_types'
import { AppLogger } from '../../wallet-sdk'

export const sendWalletRequest = (subjects: Subjects, logger?: AppLogger) =>
  subjects.outgoingMessageSubject.pipe(
    tap((payload) => {
      logger?.debug(`🔵⬆️ walletRequest`, payload)
      window.dispatchEvent(
        new CustomEvent(eventType.outgoingMessage, {
          detail: payload,
        })
      )
    })
  )
