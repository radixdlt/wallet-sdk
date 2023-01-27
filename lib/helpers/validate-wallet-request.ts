import { ZodError } from 'zod'
import { ResultAsync } from 'neverthrow'
import { WalletInteraction, WalletInteractionSchema } from '../IO/schemas'
import { createSdkError, errorType, SdkError } from './error'
import log from 'loglevel'

export const validateWalletRequest = (
  walletInteraction: WalletInteraction
): ResultAsync<WalletInteraction, SdkError> =>
  ResultAsync.fromPromise(
    WalletInteractionSchema.parseAsync(walletInteraction),
    (error) => (error as any).issues as ZodError[]
  )
    .map(() => walletInteraction)
    .mapErr((issues) => {
      log.error(`🔵💥 invalid wallet request`)
      log.debug(issues)
      return createSdkError(
        errorType.walletRequestValidation,
        walletInteraction.interactionId
      )
    })
