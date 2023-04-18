import { ZodError } from 'zod'
import { ResultAsync } from 'neverthrow'
import {
  WalletInteractionResponseSchema,
  WalletInteractionSuccessResponse,
} from '../IO/schemas'
import { createSdkError, errorType, SdkError } from './error'
import { AppLogger } from './logger'

export const validateWalletResponse = (
  walletResponse: WalletInteractionSuccessResponse,
  logger?: AppLogger
): ResultAsync<WalletInteractionSuccessResponse, SdkError> =>
  ResultAsync.fromPromise(
    WalletInteractionResponseSchema.parseAsync(walletResponse),
    (error) => (error as any).issues as ZodError[]
  )
    .map(() => walletResponse)
    .mapErr((error) => {
      logger?.error(`🔵⬇️❌ invalidWalletResponse`, { error })
      return createSdkError(
        errorType.walletRequestValidation,
        walletResponse.interactionId
      )
    })
