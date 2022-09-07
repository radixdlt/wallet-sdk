import { RequestDataItem, RequestWalletResponseType } from './request'

export const methodType = {
  request: 'request',
  sendTransaction: 'sendTransaction',
} as const

export type MethodType = keyof typeof methodType

export type WalletRequests = {
  request: RequestDataItem[]
  sendTransaction: string
}

export type WalletResponses = {
  request: RequestWalletResponseType[]
  sendTransaction: { transactionHash: string }
}
