import { ResultAsync } from 'neverthrow'
import { AppLogger } from '../helpers/logger'
import { SdkError, createSdkError, errorType } from '../wallet-sdk'
import { parseAsync } from '../helpers/parse-async'
import { Metadata, WalletInteraction, WalletInteractionItems } from './schemas'

export const walletInteractionFactory =
  (logger?: AppLogger) =>
  (
    metadata: Metadata,
    items: WalletInteractionItems,
    interactionId = crypto.randomUUID()
  ): ResultAsync<WalletInteraction, SdkError> => {
    const walletInteraction = {
      items,
      interactionId,
      metadata,
    }
    return parseAsync(WalletInteraction, walletInteraction).mapErr((issues) => {
      logger?.error(`🔵⬆️❌ invalidWalletInteraction`, issues)
      return createSdkError(
        errorType.walletRequestValidation,
        walletInteraction.interactionId
      )
    })
  }
