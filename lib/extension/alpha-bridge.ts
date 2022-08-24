import { EventType, IncomingMessage, OutgoingMessage } from '../messages'

export const alphaBridge = {
  transformIncomingMessage: (message: any): IncomingMessage => {
    switch (message.action.type) {
      case 'getAccountAddressSuccess':
        return {
          method: 'request',
          requestId: message.action.id,
          payload: [
            {
              requestType: 'accountAddress',
              addresses: [message.action.payload],
            },
          ],
        }
      case 'signTransactionSuccess':
        return {
          method: 'sendTransaction',
          requestId: message.action.id,
          payload: message.action.payload.transactionHash,
        }

      default:
        return message
    }
  },
  transformOutgoingMessage: (value: {
    event: EventType
    message: OutgoingMessage
  }) => {
    switch (value.message.method) {
      case 'request':
        return {
          event: value.event,
          payload: {
            action: {
              type: 'getAccountAddress',
              payload: '',
              id: value.message.requestId,
            },
            target: 0,
          },
        }

      case 'sendTransaction':
        return {
          event: value.event,
          payload: {
            action: {
              type: 'signTransaction',
              payload: value.message.payload,
              id: value.message.requestId,
            },
            target: 0,
          },
        }

      default:
        return value.message
    }
  },
}
