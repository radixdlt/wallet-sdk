import { createSdkError } from '../errors'
import { EventType, IncomingMessage, OutgoingMessage } from '../messages'
import {
  ActionType,
  IncomingMessage as AlphaIncomingMessage,
  MessageTarget,
  OutgoingMessage as AlphaOutgoingMessage,
} from '../extension/_types'
import { requestType } from '../methods'

export const alphaBridge = {
  transformIncomingMessage: (
    message: AlphaIncomingMessage | IncomingMessage
  ): IncomingMessage => {
    if ('action' in message) {
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
          throw new Error('unhandled alpha message')
      }
    }
    return message
  },
  transformOutgoingMessage: (input: {
    event: EventType
    payload: OutgoingMessage
  }): { payload: AlphaOutgoingMessage; event: string } => {
    switch (input.payload.method) {
      case 'request':
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

      case 'sendTransaction':
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
