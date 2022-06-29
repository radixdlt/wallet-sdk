import { Result, ResultAsync } from 'neverthrow'
import { Observable } from 'rxjs'
import { Request, SendTransaction } from '.'
import { SdkError } from '../errors'

export type MethodType = 'request' | 'sendTransaction'

export type Methods = Request | SendTransaction

export type MethodResponse<T> = {
  promise: () => ResultAsync<T, SdkError>
  observable$: Observable<Result<T, SdkError>>
}
