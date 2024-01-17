import { ResultAsync } from 'neverthrow'
import { AppLogger } from '../helpers/logger'
import { SdkError, createSdkError, errorType } from '../wallet-sdk'
import { parseAsync } from '../helpers/parse-async'
import {
  Metadata,
  WalletInteraction,
  WalletInteractionArbitraryData,
  WalletInteractionItems,
} from '@radixdlt/radix-connect-schemas'

export const walletInteractionFactory =
  (logger?: AppLogger) =>
  (
    metadata: Metadata,
    items: WalletInteractionItems,
    interactionId = crypto.randomUUID(),
    arbitraryData: WalletInteractionArbitraryData = {}
    // eslint-disable-next-line max-params
  ): ResultAsync<WalletInteraction, SdkError> => {
    const walletInteraction = {
      items,
      discriminator: 'walletInteraction',
      interactionId,
      metadata,
      arbitraryData,
    } satisfies WalletInteraction
    return parseAsync(WalletInteraction, walletInteraction).mapErr((issues) => {
      logger?.error(`🔵⬆️❌ invalidWalletInteraction`, issues)
      return createSdkError(
        errorType.walletRequestValidation,
        walletInteraction.interactionId
      )
    })
  }
