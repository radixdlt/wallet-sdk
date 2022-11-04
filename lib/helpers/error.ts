export const sdkError = (error: unknown) => error as SdkError

export const errorType = {
  missingAddress: 'missingAddress',
  rejectedByUser: 'rejectedByUser',
  missingExtension: 'missingExtension',
  unavailable: 'unavailable',
  internal: 'internal',
  submitTransaction: 'submitTransaction',
} as const

type ErrorType = keyof typeof errorType

type GenericError<T extends ErrorType> = {
  requestId: string
  error: T
  message: string
}

export type SdkError = GenericError<keyof typeof errorType>

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
