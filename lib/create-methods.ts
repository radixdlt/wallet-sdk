import { ResultAsync } from 'neverthrow'
import { SdkError } from './helpers/error'
import { decodeWalletResponse } from './IO/decode-wallet-response'
import { transformMethodInput } from './IO/transform-method-input'
import { createMessage } from './messages/create-message'
import { MessageLifeCycleEvent } from './messages/events/_types'
import { OutgoingMessage } from './messages/_types'
import { Method, requestType, Wallet } from './_types'

export const createMethods = (
  sendMessageToWallet: (
    eventCallback?: ((eventType: 'receivedByExtension') => void) | undefined
  ) => (message: OutgoingMessage) => ResultAsync<Wallet['response'], SdkError>
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
      .andThen(createMessage)
      .asyncAndThen(sendMessageToWallet(eventCallback))
      .map(decodeWalletResponse<Output>)

  const sendTransaction = (
    input: Method['sendTransaction']['input'],
    eventCallback?: (messageEvent: MessageLifeCycleEvent) => void
  ) =>
    transformMethodInput({ [requestType.sendTransaction]: input })
      .andThen(createMessage)
      .asyncAndThen(sendMessageToWallet(eventCallback))
      .map(decodeWalletResponse<Method['sendTransaction']['output']>)

  return {
    request,
    sendTransaction,
  }
}
