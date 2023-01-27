import { Ok, ok } from 'neverthrow'
import { WalletInteraction } from '../IO/schemas'
import { Metadata } from './_types'

export const createMessage =
  (metadata: Metadata) =>
  <T extends WalletInteraction['items']>(
    items: T,
    interactionId = crypto.randomUUID()
  ): Ok<WalletInteraction, never> =>
    ok({
      items,
      interactionId,
      metadata,
    })
