import { AccountAddressWalletResponse } from './request'

export const methodType = {
  request: 'request',
  sendTransaction: 'sendTransaction',
} as const

export type MethodType = keyof typeof methodType

export type WalletRequests = {
  request: Request
  sendTransaction: string
}

export type WalletResponses = {
  request: AccountAddressWalletResponse[]
  sendTransaction: { transactionHash: string }
}
