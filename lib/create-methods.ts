import { ResultAsync } from 'neverthrow'
import { SdkError } from './helpers/error'
import { validateWalletRequest } from './helpers/validate-wallet-request'
import { validateWalletResponse } from './helpers/validate-wallet-response'
import { decodeWalletResponse } from './IO/decode-wallet-response'
import {
  Metadata,
  WalletInteraction,
  WalletInteractionSuccessResponse,
} from './IO/schemas'
import { transformMethodInput } from './IO/transform-method-input'
import { createMessage } from './messages/create-message'
import { CallbackFns } from './messages/events/_types'
import { Method, requestType } from './_types'

type SendWalletInteraction = (
  callbackFns: Partial<CallbackFns>
) => (
  message: WalletInteraction
) => ResultAsync<WalletInteractionSuccessResponse, SdkError>

export const createMethods = (
  metadata: Metadata,
  sendMessageToWallet: SendWalletInteraction
) => {
  const request = <
    Input extends Method['request']['input'],
    Output extends keyof Input extends keyof Method['request']['output']
      ? {
          [Key in keyof Input]: (x: Method['request']['output'][Key]) => void
        }[keyof Input] extends (x: infer T) => void
        ? T
        : never
      : never
  >(
    input: Input,
    callbackFns: Partial<CallbackFns> = {}
  ) =>
    transformMethodInput(input)
      .andThen(createMessage(metadata))
      .asyncAndThen(validateWalletRequest)
      .andThen(sendMessageToWallet(callbackFns))
      .andThen(validateWalletResponse)
      .map((response) => response.items)
      .map(decodeWalletResponse<Output>)

  const sendTransaction = (
    input: Method['sendTransaction']['input'],
    callbackFns: Partial<CallbackFns> = {}
  ) =>
    transformMethodInput({ [requestType.send]: input })
      .andThen(createMessage(metadata))
      .asyncAndThen(validateWalletRequest)
      .andThen(sendMessageToWallet(callbackFns))
      .andThen(validateWalletResponse)
      .map((response) => response.items)
      .map(decodeWalletResponse<Method['sendTransaction']['output']>)

  return {
    request,
    sendTransaction,
  }
}
