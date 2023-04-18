import { ZodError } from 'zod'
import { ResultAsync } from 'neverthrow'
import { WalletInteraction, WalletInteractionSchema } from '../IO/schemas'
import { createSdkError, errorType, SdkError } from './error'
import { AppLogger } from './logger'

export const validateWalletRequest = (
  walletInteraction: WalletInteraction,
  logger?: AppLogger
): ResultAsync<WalletInteraction, SdkError> =>
  ResultAsync.fromPromise(
    WalletInteractionSchema.parseAsync(walletInteraction),
    (error) => (error as any).issues as ZodError[]
  )
    .map(() => walletInteraction)
    .mapErr((issues) => {
      logger?.error(`🔵⬆️❌ invalidWalletRequest`, {
        issues,
        walletInteraction,
      })
      return createSdkError(
        errorType.walletRequestValidation,
        walletInteraction.interactionId
      )
    })
