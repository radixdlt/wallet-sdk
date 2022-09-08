import { createSdkError, SdkError } from '../errors'
import { IncomingMessageType, OutgoingMessageType } from '../messages'
import {
  ActionType,
  IncomingMessage as AlphaIncomingMessage,
  MessageTarget,
  OutgoingMessage as AlphaOutgoingMessage,
} from '../extension/_types'
import { requestType } from '../methods'
import { methodType } from '../methods/_types'
import { OutgoingMessageEvent } from '../messages/events/_types'

export const alphaBridge = {
  transformIncomingMessage: (
    message: AlphaIncomingMessage | IncomingMessageType
  ): IncomingMessageType | SdkError => {
    if (!('action' in message)) return message

    switch (message.action.type) {
      case 'getAccountAddressSuccess':
        return {
          method: 'request',
          requestId: message.action.id,
          payload: [
            {
              requestType: requestType.accountAddresses,
              addresses: [
                { address: message.action.payload, label: 'active account' },
              ],
            },
          ],
        }
      case 'getAccountAddressFailure':
        return createSdkError('missingAddress', message.action.id)

      case 'signTransactionSuccess':
        return {
          method: 'sendTransaction',
          requestId: message.action.id,
          payload: {
            transactionHash: message.action.payload.transactionHash,
          },
        }

      case 'signTransactionFailure':
        return createSdkError('submitTransaction', message.action.id)

      default:
        throw new Error('unhandled alpha wallet message')
    }
  },
  transformOutgoingMessage: (input: {
    event: OutgoingMessageEvent
    payload: OutgoingMessageType
  }): { payload: AlphaOutgoingMessage; event: OutgoingMessageEvent } => {
    switch (input.payload.method) {
      case methodType.request:
        return {
          event: input.event,
          payload: {
            action: {
              type: ActionType.GetAccountAddress,
              payload: '',
              id: input.payload.requestId,
            },
            target: MessageTarget.Extension,
          },
        }

      case methodType.sendTransaction:
        return {
          event: input.event,
          payload: {
            action: {
              type: ActionType.SignTransaction,
              payload: input.payload.payload,
              id: input.payload.requestId,
            },
            target: MessageTarget.Extension,
          },
        }

      default:
        return input.payload
    }
  },
}
