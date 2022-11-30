import { Result, ResultAsync } from 'neverthrow'
import { firstValueFrom, Observable } from 'rxjs'
import { WalletSuccessResponse } from '../IO/schemas'
import { SdkError, sdkError } from './error'

export const unwrapObservable = (
  input: Observable<Result<WalletSuccessResponse, SdkError>>
) =>
  ResultAsync.fromPromise(firstValueFrom(input), sdkError).andThen(
    (result) => result
  )
