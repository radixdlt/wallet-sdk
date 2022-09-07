import { Result, ResultAsync } from 'neverthrow'
import { firstValueFrom, Observable, isObservable } from 'rxjs'
import { SdkError } from '../errors'
import { sdkError } from '../utils/error'

export const createMethodResponse = <T>(
  input: Observable<Result<T, SdkError>> | ResultAsync<T, SdkError>
) =>
  isObservable(input)
    ? ResultAsync.fromPromise(firstValueFrom(input), sdkError).andThen(
        (result) => result
      )
    : input
