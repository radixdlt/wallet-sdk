export const errorType = {
  missingAddress: 'missingAddress',
  rejectedByUser: 'rejectedByUser',
  missingExtension: 'missingExtension',
  unavailable: 'unavailable',
  internal: 'internal',
  submitTransaction: 'submitTransaction',
} as const

type ErrorTypes = typeof errorType
type ErrorType = keyof ErrorTypes

type GenericError<T extends ErrorType> = {
  requestId: string
  error: T
  message: string
}

type MissingAddressError = GenericError<'missingAddress'>
type RejectedByUserError = GenericError<'rejectedByUser'>
type MissingExtensionError = GenericError<'missingExtension'>
type UnavailableError = GenericError<'unavailable'>
type InternalError = GenericError<'internal'>
type SubmitTransactionError = GenericError<'submitTransaction'>

export type SdkError =
  | MissingAddressError
  | RejectedByUserError
  | MissingExtensionError
  | UnavailableError
  | InternalError
  | SubmitTransactionError

const defaultErrorMessage = {
  [errorType.internal]: 'unknown error',
  [errorType.missingAddress]: 'account address could not be found',
  [errorType.missingExtension]: 'extension could not be found',
  [errorType.rejectedByUser]: 'user rejected request',
  [errorType.submitTransaction]: 'could not submit transaction to the network',
  [errorType.unavailable]: 'connection could not be established at this time',
}

export const createSdkError = (
  error: ErrorType,
  requestId: string,
  message?: string
): SdkError => ({
  error,
  requestId,
  message: message || defaultErrorMessage[error],
})
