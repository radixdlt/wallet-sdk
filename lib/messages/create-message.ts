import { Ok, ok } from 'neverthrow'
import { WalletRequest } from '../IO/schemas'
import { Metadata } from './_types'

export const createMessage =
  (metadata: Metadata) =>
  <T extends WalletRequest['items']>(
    items: T,
    requestId = crypto.randomUUID()
  ): Ok<WalletRequest, never> =>
    ok({
      items,
      requestId,
      metadata,
    })
