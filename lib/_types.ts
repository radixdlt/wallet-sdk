import { RequestMethod, requestMethodRequestType } from './methods/request'
import {
  SendTransactionMethod,
  sendTransactionMethodRequestType,
} from './methods/send-transaction'

export const requestType = {
  ...requestMethodRequestType,
  ...sendTransactionMethodRequestType,
} as const

export type Method = {
  request: {
    input: RequestMethod['method']['input']
    output: RequestMethod['method']['output']
  }
  sendTransaction: {
    input: SendTransactionMethod['method']['input']
    output: SendTransactionMethod['method']['output']
  }
}

export type Wallet = {
  requestItem:
    | SendTransactionMethod['wallet']['request']
    | RequestMethod['wallet']['request']
  response: (
    | RequestMethod['wallet']['response']
    | SendTransactionMethod['wallet']['response']
  )[]
}
