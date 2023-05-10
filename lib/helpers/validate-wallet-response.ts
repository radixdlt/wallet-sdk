import { ResultAsync, err, ok } from 'neverthrow'
import {
  WalletInteractionResponse,
  WalletInteractionSuccessResponse,
} from '../IO/v1/schemas'
import { ZodError } from 'zod'
import { SdkError, createSdkError } from './error'

export const validateWalletResponse = (
  walletResponse: unknown
): ResultAsync<WalletInteractionSuccessResponse, SdkError> =>
  ResultAsync.fromPromise(
    WalletInteractionResponse.parseAsync(walletResponse),
    (error) => (error as any).issues as ZodError[]
  )
    .andThen((response) =>
      response.discriminator === 'success'
        ? ok(response)
        : err(response as SdkError)
    )
    .mapErr(() => createSdkError('walletResponseValidation', ''))
