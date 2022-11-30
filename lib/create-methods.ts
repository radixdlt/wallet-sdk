import { ResultAsync } from 'neverthrow'
import { SdkError } from './helpers/error'
import { validateWalletRequest } from './helpers/validate-wallet-request'
import { validateWalletResponse } from './helpers/validate-wallet-response'
import { decodeWalletResponse } from './IO/decode-wallet-response'
import { Metadata, WalletRequest, WalletSuccessResponse } from './IO/schemas'
import { transformMethodInput } from './IO/transform-method-input'
import { createMessage } from './messages/create-message'
import { MessageLifeCycleEvent } from './messages/events/_types'
import { Method, requestType } from './_types'

type EventCallbackFn = ((eventType: 'receivedByExtension') => void) | undefined

type SendWalletRequest = (
  eventCallback?: EventCallbackFn
) => (message: WalletRequest) => ResultAsync<WalletSuccessResponse, SdkError>

export const createMethods = (
  metadata: Metadata,
  sendMessageToWallet: SendWalletRequest
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
    eventCallback?: (messageEvent: MessageLifeCycleEvent) => void
  ) =>
    transformMethodInput(input)
      .andThen(createMessage(metadata))
      .asyncAndThen(validateWalletRequest)
      .andThen(sendMessageToWallet(eventCallback))
      .andThen(validateWalletResponse)
      .map((response) => response.items)
      .map(decodeWalletResponse<Output>)

  const sendTransaction = (
    input: Method['sendTransaction']['input'],
    eventCallback?: (messageEvent: MessageLifeCycleEvent) => void
  ) =>
    transformMethodInput({ [requestType.sendTransaction]: input })
      .andThen(createMessage(metadata))
      .asyncAndThen(validateWalletRequest)
      .andThen(sendMessageToWallet(eventCallback))
      .andThen(validateWalletResponse)
      .map((response) => response.items)
      .map(decodeWalletResponse<Method['sendTransaction']['output']>)

  return {
    request,
    sendTransaction,
  }
}
