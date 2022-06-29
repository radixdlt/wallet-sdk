import { SdkError } from '../errors'

export const sdkError = (error: unknown) => error as SdkError
