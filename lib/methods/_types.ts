import { Result, ResultAsync } from 'neverthrow'
import { Observable } from 'rxjs'
import { Request, SendTransaction } from '.'

export type MethodType = 'request' | 'sendTransaction'

export type Methods = Request | SendTransaction

export type RejectedByUser = {
  error: 'rejectedByUser'
  message: 'user rejected request'
}

export type MissingExtension = {
  error: 'missingExtension'
  message: 'extension could not be found'
}

export type Unavailable = {
  error: 'unavailable'
  message: 'connection could not be established at this time'
}

export type Internal = {
  error: 'internal'
  message: string
}

export type SdkError =
  | RejectedByUser
  | MissingExtension
  | Unavailable
  | Internal

export type MethodResponse<T> = {
  promise: () => ResultAsync<T, SdkError>
  observable$: Observable<Result<T, SdkError>>
}
