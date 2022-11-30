import { ZodError } from 'zod'
import { ResultAsync } from 'neverthrow'
import { WalletResponseSchema, WalletSuccessResponse } from '../IO/schemas'
import log from 'loglevel'
import { createSdkError, errorType, SdkError } from './error'

export const validateWalletResponse = (
  walletResponse: WalletSuccessResponse
): ResultAsync<WalletSuccessResponse, SdkError> =>
  ResultAsync.fromPromise(
    WalletResponseSchema.parseAsync(walletResponse),
    (error) => (error as any).issues as ZodError[]
  )
    .map(() => walletResponse)
    .mapErr(() => {
      log.error(`🔵💥 invalid wallet response`)
      return createSdkError(
        errorType.walletRequestValidation,
        walletResponse.requestId
      )
    })
