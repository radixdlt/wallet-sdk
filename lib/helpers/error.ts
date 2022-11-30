export const sdkError = (error: unknown) => error as SdkError

export const errorType = {
  rejectedByUser: 'rejectedByUser',
  missingExtension: 'missingExtension',
  walletRequestValidation: 'walletRequestValidation',
  walletResponseValidation: 'walletResponseValidation',
} as const

type ErrorType = keyof typeof errorType

type GenericError<T extends ErrorType> = {
  requestId: string
  error: T
  message?: string
}

export type SdkError = GenericError<keyof typeof errorType>

const defaultErrorMessage = {
  [errorType.missingExtension]: 'extension could not be found',
  [errorType.rejectedByUser]: 'user rejected request',
  [errorType.walletRequestValidation]: '',
  [errorType.walletResponseValidation]: '',
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
