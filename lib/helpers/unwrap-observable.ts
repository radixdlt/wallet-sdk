import { Result, ResultAsync } from 'neverthrow'
import { firstValueFrom, Observable } from 'rxjs'
import { SdkError, sdkError } from './error'

export const unwrapObservable = <T>(input: Observable<Result<T, SdkError>>) =>
  ResultAsync.fromPromise(firstValueFrom(input), sdkError).andThen(
    (result) => result
  )
