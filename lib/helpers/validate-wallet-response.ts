import { ZodError } from 'zod'
import { ResultAsync } from 'neverthrow'
import {
  WalletInteractionResponseSchema,
  WalletInteractionSuccessResponse,
} from '../IO/schemas'
import log from 'loglevel'
import { createSdkError, errorType, SdkError } from './error'

export const validateWalletResponse = (
  walletResponse: WalletInteractionSuccessResponse
): ResultAsync<WalletInteractionSuccessResponse, SdkError> =>
  ResultAsync.fromPromise(
    WalletInteractionResponseSchema.parseAsync(walletResponse),
    (error) => (error as any).issues as ZodError[]
  )
    .map(() => walletResponse)
    .mapErr(() => {
      log.error(`🔵💥 invalid wallet response`)
      return createSdkError(
        errorType.walletRequestValidation,
        walletResponse.interactionId
      )
    })
