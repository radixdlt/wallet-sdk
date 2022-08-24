import { SdkError } from '../methods'

export const sdkError = (error: unknown) => error as SdkError
