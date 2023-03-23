export const sdkError = (error: unknown) => error as SdkError

export const errorType = {
  rejectedByUser: 'rejectedByUser',
  missingExtension: 'missingExtension',
  canceledByUser: 'canceledByUser',
  walletRequestValidation: 'walletRequestValidation',
  walletResponseValidation: 'walletResponseValidation',
  wrongNetwork: 'wrongNetwork',
  failedToPrepareTransaction: 'failedToPrepareTransaction',
  failedToCompileTransaction: 'failedToCompileTransaction',
  failedToSignTransaction: 'failedToSignTransaction',
  failedToSubmitTransaction: 'failedToSubmitTransaction',
  failedToPollSubmittedTransaction: 'failedToPollSubmittedTransaction',
  submittedTransactionWasDuplicate: 'submittedTransactionWasDuplicate',
  submittedTransactionHasFailedTransactionStatus:
    'submittedTransactionHasFailedTransactionStatus',
  submittedTransactionHasRejectedTransactionStatus:
    'submittedTransactionHasRejectedTransactionStatus',
  failedToFindAccountWithEnoughFundsToLockFee:
    'failedToFindAccountWithEnoughFundsToLockFee',
  wrongAccountType: 'wrongAccountType',
  unknownWebsite: 'unknownWebsite',
  radixJsonNotFound: 'radixJsonNotFound',
  unknownDappDefinitionAddress: 'unknownDappDefinitionAddress',
  invalidPersona: 'invalidPersona',
} as const

type ErrorType = keyof typeof errorType

type GenericError<T extends ErrorType> = {
  interactionId: string
  error: T
  message?: string
}

export type SdkError = GenericError<keyof typeof errorType>

const defaultErrorMessage = new Map<ErrorType, string>()
  .set(errorType.missingExtension, 'extension could not be found')
  .set(errorType.rejectedByUser, 'user rejected request')
  .set(errorType.canceledByUser, 'user has canceled the request')

export const createSdkError = (
  error: ErrorType,
  interactionId: string,
  message?: string
): SdkError => ({
  error,
  interactionId,
  message: message || defaultErrorMessage.get(error) || '',
})
