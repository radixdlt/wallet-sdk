import { Result, ResultAsync } from 'neverthrow'
import { firstValueFrom, Observable } from 'rxjs'
import { WalletInteractionSuccessResponse } from '../IO/schemas'
import { SdkError, sdkError } from './error'

export const unwrapObservable = (
  input: Observable<Result<WalletInteractionSuccessResponse, SdkError>>
) =>
  ResultAsync.fromPromise(firstValueFrom(input), sdkError).andThen(
    (result) => result
  )
