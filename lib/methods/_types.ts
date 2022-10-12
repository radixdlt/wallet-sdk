import { RequestItem, RequestWalletResponseType } from './request'

export const methodType = {
  request: 'request',
  sendTransaction: 'sendTransaction',
} as const

export type MethodType = keyof typeof methodType

export type WalletRequests = {
  request: RequestItem[]
  sendTransaction: {
    transactionManifest: string
    version: number
    blobs?: string[]
    message?: string
  }
}

export type WalletResponses = {
  request: RequestWalletResponseType[]
  sendTransaction: { transactionIntentHash: string }
}
