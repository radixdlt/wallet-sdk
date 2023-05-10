import { Result, ResultAsync } from 'neverthrow'
import { firstValueFrom, Observable } from 'rxjs'
import { SdkError, sdkError } from './error'

export const unwrapObservable = (
  input: Observable<Result<any, SdkError>>
): ResultAsync<any, SdkError> =>
  ResultAsync.fromPromise(firstValueFrom(input), sdkError).andThen(
    (result) => result
  )
