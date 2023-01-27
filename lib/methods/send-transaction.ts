import { SendTransaction } from '../IO/request-items/send-transaction'

export type SendTransactionMethod = SendTransaction
export const sendTransactionMethodRequestType = {
  send: 'send',
} as const
