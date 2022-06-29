import { Result, ResultAsync } from 'neverthrow'
import { firstValueFrom, Observable, first } from 'rxjs'
import { SdkError } from '../errors'
import { sdkError } from './error'

export const response = <T>(request$: Observable<Result<T, SdkError>>) => ({
  promise: () =>
    ResultAsync.fromPromise(firstValueFrom(request$), sdkError).andThen(
      (result) => result
    ),
  observable$: request$.pipe(first()),
})
