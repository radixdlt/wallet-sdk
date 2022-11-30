import { ZodError } from 'zod'
import { ResultAsync } from 'neverthrow'
import { WalletRequest, WalletRequestSchema } from '../IO/schemas'
import { createSdkError, errorType, SdkError } from './error'
import log from 'loglevel'

export const validateWalletRequest = (
  walletRequest: WalletRequest
): ResultAsync<WalletRequest, SdkError> =>
  ResultAsync.fromPromise(
    WalletRequestSchema.parseAsync(walletRequest),
    (error) => (error as any).issues as ZodError[]
  )
    .map(() => walletRequest)
    .mapErr(() => {
      log.error(`🔵💥 invalid wallet request`)
      return createSdkError(
        errorType.walletRequestValidation,
        walletRequest.requestId
      )
    })
